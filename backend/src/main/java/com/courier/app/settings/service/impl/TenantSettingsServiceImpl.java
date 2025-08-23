package com.courier.app.settings.service.impl;

import com.courier.app.settings.config.TenantDefaultProperties;
import com.courier.app.settings.dto.TenantSettingsDTO;
import com.courier.app.settings.model.TenantSettings;
import com.courier.app.settings.repository.TenantSettingsRepository;
import com.courier.app.settings.service.TenantSettingsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.flywaydb.core.Flyway;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Stream;

@Service
@Transactional
@RequiredArgsConstructor
public class TenantSettingsServiceImpl implements TenantSettingsService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TenantSettingsRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TenantDefaultProperties defaultProperties;
    private final DataSource dataSource;

    @Override
    public TenantSettingsDTO getSettingsForCurrentTenant() {
        String tenantId = getCurrentTenantId();
        TenantSettings settings = repository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
        return toDto(settings);
    }

    @Override
    public TenantSettingsDTO saveOrUpdateSettings(TenantSettingsDTO dto) {
        String tenantId = getCurrentTenantId();
        validateSettings(dto);
        TenantSettings entity = repository.findByTenantId(tenantId).orElse(new TenantSettings());
        entity.setTenantId(dto.getBrandName());
        entity.setBusinessHours(toJson(dto.getBusinessHours()));
        entity.setBrandName(dto.getBrandName());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setPrimaryColor(dto.getPrimaryColor());
        entity.setSecondaryColor(dto.getSecondaryColor());
        entity.setTimezone(dto.getTimezone());

        TenantSettings saved = repository.save(entity);
        return toDto(saved);
    }

    @Override
    public void deleteSettingsForCurrentTenant() {
        String tenantId = getCurrentTenantId();
        repository.deleteByTenantId(tenantId);
    }
    // Utility methods
    private TenantSettingsDTO toDto(TenantSettings entity) {
        TenantSettingsDTO dto = new TenantSettingsDTO();
        dto.setBusinessHours(fromJson(entity.getBusinessHours()));
        dto.setBrandName(entity.getBrandName());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setPrimaryColor(entity.getPrimaryColor());
        dto.setSecondaryColor(entity.getSecondaryColor());
        dto.setTimezone(entity.getTimezone());
        return dto;
    }
    private String toJson(Map<String, String> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new RuntimeException("Invalid business hours format");
        }
    }

    private Map<String, String> fromJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Invalid business hours format");
        }
    }

    private void validateSettings(TenantSettingsDTO dto) {
        if (!ZoneId.getAvailableZoneIds().contains(dto.getTimezone())) {
            throw new RuntimeException("Invalid timezone");
        }

        for (String value : dto.getBusinessHours().values()) {
            if (!value.matches("(\\d{1,2}-\\d{1,2})|closed")) {
                throw new RuntimeException("Invalid business hours format");
            }
        }
    }

    private String getCurrentTenantId() {
        // TODO: Replace this with real tenant extraction from security context or token
        return "tenantId";
    }

    @Transactional(Transactional.TxType.NEVER)
    public void createTenant(String tenantId) throws SQLException {
        String schema = tenantSchema(tenantId);

        // 1) Create schema in AUTOCOMMIT so DDL is visible immediately
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            if (!conn.getAutoCommit()) conn.setAutoCommit(true);
            st.execute("SET lock_timeout = '5s'; SET statement_timeout = '2min'");
            st.execute("CREATE SCHEMA IF NOT EXISTS " + q(schema));
        }

        // 2) Run Flyway (no surrounding Spring TX)
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration_tenant")
                .schemas(schema)
                .defaultSchema(schema)
                .createSchemas(false)           // we created it above
                .baselineOnMigrate(false)
                .lockRetryCount(10)
                .connectRetries(3)
                .load();

        Arrays.stream(flyway.info().pending())
                .forEach(p -> System.out.println("Pending: " + p.getVersion() + " " + p.getDescription()));

        flyway.migrate();

        // 3) Save defaults inside a WRITE transaction and same connection
        saveDefaultSettingsInTenantSchema(tenantId, schema);
    }

    /**
     * IMPORTANT:
     * - Must be a WRITE transaction (readOnly=false).
     * - We set search_path on the SAME JDBC connection JPA uses,
     *   by using Hibernate Session#doWork.
     */
    @Transactional(Transactional.TxType.REQUIRES_NEW)
    protected void saveDefaultSettingsInTenantSchema(String tenantId, String schema) {
        // Set search_path on the JPA connection participating in THIS TX
        entityManager.unwrap(org.hibernate.Session.class).doWork(conn -> {
            try (Statement st = conn.createStatement()) {
                st.execute("SET search_path TO " + q(schema) + ", public");
            }
        });

        TenantSettings settings = new TenantSettings();
        settings.setTenantId(tenantId);
        settings.setBusinessHours(defaultProperties.getBusinessHours());
        settings.setBrandName(defaultProperties.getBrandName());
        settings.setLogoUrl(defaultProperties.getLogoUrl());
        settings.setPrimaryColor(defaultProperties.getPrimaryColor());
        settings.setSecondaryColor(defaultProperties.getSecondaryColor());
        settings.setTimezone(defaultProperties.getTimezone());

        repository.save(settings);
    }

    private String tenantSchema(String slug) {
        return "tenant_" + slug.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_]", "_");
    }
    private String q(String ident) { return "\"" + ident.replace("\"", "\"\"") + "\""; }
}

