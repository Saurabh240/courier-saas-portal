package com.courier.app.settings.service.impl;

import com.courier.app.usermgmt.config.TenantDefaultProperties;
import com.courier.app.usermgmt.multiTenancy.TenantContext;
import com.courier.app.settings.dto.BusinessHoursDTO;
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

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
@Transactional
@RequiredArgsConstructor
public class TenantSettingsServiceImpl implements TenantSettingsService {

    private static final Set<String> VALID_DAYS = Set.of(
            "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN");

    private static final Pattern HEX_COLOR = Pattern.compile("^#[0-9A-Fa-f]{6}$");
    private static final Pattern TIME_HHMM = Pattern.compile("^([01]\\d|2[0-3]):[0-5]\\d$");
    private static final Pattern URL_PATTERN = Pattern.compile("^https?://[^\\s/$.?#].\\S*$");

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
                .orElseGet(() -> createDefaultSettings(tenantId));
        return toDto(settings);
    }

    @Override
    public TenantSettingsDTO updateSettings(TenantSettingsDTO dto) {
        String tenantId = getCurrentTenantId();
        validateFull(dto);

        TenantSettings entity = repository.findByTenantId(tenantId)
                .orElseGet(() -> {
                    TenantSettings e = new TenantSettings();
                    e.setTenantId(tenantId);
                    return e;
                });

        entity.setBrandName(dto.getBrandName());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setPrimaryColor(dto.getPrimaryColor());
        entity.setSecondaryColor(dto.getSecondaryColor());
        entity.setTimezone(dto.getTimezone());
        entity.setBusinessHours(toJson(dto.getBusinessHours()));

        return toDto(repository.save(entity));
    }

    @Override
    public TenantSettingsDTO patchSettings(Map<String, Object> updates) {
        String tenantId = getCurrentTenantId();
        TenantSettings entity = repository.findByTenantId(tenantId)
                .orElseGet(() -> createDefaultSettings(tenantId));

        if (updates.containsKey("brandName")) {
            String value = requireString(updates.get("brandName"), "brandName");
            if (value.isBlank()) {
                throw new IllegalArgumentException("brandName cannot be blank");
            }
            entity.setBrandName(value);
        }

        if (updates.containsKey("logoUrl")) {
            String value = requireString(updates.get("logoUrl"), "logoUrl");
            if (!URL_PATTERN.matcher(value).matches()) {
                throw new IllegalArgumentException("logoUrl must be a valid URL");
            }
            entity.setLogoUrl(value);
        }

        if (updates.containsKey("primaryColor")) {
            String value = requireString(updates.get("primaryColor"), "primaryColor");
            if (!HEX_COLOR.matcher(value).matches()) {
                throw new IllegalArgumentException("primaryColor must be a hex value like #RRGGBB");
            }
            entity.setPrimaryColor(value);
        }

        if (updates.containsKey("secondaryColor")) {
            String value = requireString(updates.get("secondaryColor"), "secondaryColor");
            if (!HEX_COLOR.matcher(value).matches()) {
                throw new IllegalArgumentException("secondaryColor must be a hex value like #RRGGBB");
            }
            entity.setSecondaryColor(value);
        }

        if (updates.containsKey("timezone")) {
            String value = requireString(updates.get("timezone"), "timezone");
            if (!ZoneId.getAvailableZoneIds().contains(value)) {
                throw new IllegalArgumentException("Invalid timezone: " + value);
            }
            entity.setTimezone(value);
        }

        if (updates.containsKey("businessHours")) {
            Object raw = updates.get("businessHours");
            Map<String, BusinessHoursDTO> hours = objectMapper.convertValue(
                    raw, new TypeReference<>() {});
            validateBusinessHours(hours);
            entity.setBusinessHours(toJson(hours));
        }

        return toDto(repository.save(entity));
    }

    @Override
    public void deleteSettingsForCurrentTenant() {
        repository.deleteByTenantId(getCurrentTenantId());
    }

    // ---------- helpers ----------

    private TenantSettings createDefaultSettings(String tenantId) {
        TenantSettings settings = new TenantSettings();
        settings.setTenantId(tenantId);
        settings.setBrandName(defaultProperties.getBrandName());
        settings.setLogoUrl(defaultProperties.getLogoUrl());
        settings.setPrimaryColor(defaultProperties.getPrimaryColor());
        settings.setSecondaryColor(defaultProperties.getSecondaryColor());
        settings.setTimezone(defaultProperties.getTimezone());
        settings.setBusinessHours(defaultProperties.getBusinessHours());
        return repository.save(settings);
    }

    private TenantSettingsDTO toDto(TenantSettings entity) {
        TenantSettingsDTO dto = new TenantSettingsDTO();
        dto.setBrandName(entity.getBrandName());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setPrimaryColor(entity.getPrimaryColor());
        dto.setSecondaryColor(entity.getSecondaryColor());
        dto.setTimezone(entity.getTimezone());
        dto.setBusinessHours(fromJson(entity.getBusinessHours()));
        return dto;
    }

    private String toJson(Map<String, BusinessHoursDTO> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid business hours format", e);
        }
    }

    private Map<String, BusinessHoursDTO> fromJson(String json) {
        if (json == null || json.isBlank()) {
            return new LinkedHashMap<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new IllegalStateException("Stored business hours JSON is corrupted", e);
        }
    }

    private void validateFull(TenantSettingsDTO dto) {
        if (!ZoneId.getAvailableZoneIds().contains(dto.getTimezone())) {
            throw new IllegalArgumentException("Invalid timezone: " + dto.getTimezone());
        }
        if (dto.getLogoUrl() != null && !URL_PATTERN.matcher(dto.getLogoUrl()).matches()) {
            throw new IllegalArgumentException("logoUrl must be a valid URL");
        }
        if (dto.getPrimaryColor() != null && !HEX_COLOR.matcher(dto.getPrimaryColor()).matches()) {
            throw new IllegalArgumentException("primaryColor must be a hex value like #RRGGBB");
        }
        if (dto.getSecondaryColor() != null && !HEX_COLOR.matcher(dto.getSecondaryColor()).matches()) {
            throw new IllegalArgumentException("secondaryColor must be a hex value like #RRGGBB");
        }
        validateBusinessHours(dto.getBusinessHours());
    }

    private void validateBusinessHours(Map<String, BusinessHoursDTO> hours) {
        if (hours == null) {
            return;
        }
        Set<String> seenDays = new HashSet<>();
        for (Map.Entry<String, BusinessHoursDTO> entry : hours.entrySet()) {
            String day = entry.getKey() == null ? null : entry.getKey().toUpperCase(Locale.ROOT);
            if (day == null || !VALID_DAYS.contains(day)) {
                throw new IllegalArgumentException("Invalid day key in businessHours: " + entry.getKey());
            }
            if (!seenDays.add(day)) {
                throw new IllegalArgumentException("Duplicate day key in businessHours: " + day);
            }
            BusinessHoursDTO bh = entry.getValue();
            if (bh == null || bh.getOpen() == null || bh.getClose() == null) {
                throw new IllegalArgumentException("open/close required for day: " + day);
            }
            if (!TIME_HHMM.matcher(bh.getOpen()).matches() || !TIME_HHMM.matcher(bh.getClose()).matches()) {
                throw new IllegalArgumentException("open/close must be HH:mm for day: " + day);
            }
            if (bh.getOpen().compareTo(bh.getClose()) >= 0) {
                throw new IllegalArgumentException("open must be before close for day: " + day);
            }
        }
    }

    private String requireString(Object value, String field) {
        if (!(value instanceof String s)) {
            throw new IllegalArgumentException(field + " must be a string");
        }
        return s;
    }

    private String getCurrentTenantId() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId == null || tenantId.isBlank()) {
            throw new IllegalStateException("No tenant resolved in TenantContext for this request");
        }
        return tenantId;
    }

    // ---------- unchanged tenant-provisioning flow below ----------

    @Transactional(Transactional.TxType.NEVER)
    public void createTenant(String tenantId) throws SQLException {
        String schema = tenantSchema(tenantId);

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            if (!conn.getAutoCommit()) conn.setAutoCommit(true);
            st.execute("SET lock_timeout = '5s'; SET statement_timeout = '2min'");
            st.execute("CREATE SCHEMA IF NOT EXISTS " + q(schema));
        }

        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration_tenant")
                .schemas(schema)
                .defaultSchema(schema)
                .table("flyway_tenant_schema_history")
                .createSchemas(false)
                .baselineOnMigrate(true)
                .lockRetryCount(10)
                .connectRetries(3)
                .load();

        Arrays.stream(flyway.info().pending())
                .forEach(p -> System.out.println("Pending: " + p.getVersion() + " " + p.getDescription()));

        flyway.migrate();

        registerTenant(tenantId, schema);
        saveDefaultSettingsInTenantSchema(tenantId, schema);
    }

    private void registerTenant(String tenantId, String schema) throws SQLException {
        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            st.execute("SET SCHEMA 'public'");
            try (PreparedStatement ps = conn.prepareStatement("""
                    INSERT INTO tenant_registry (tenant_id, schema_name, display_name, active)
                    VALUES (?, ?, ?, TRUE)
                    ON CONFLICT (tenant_id) DO UPDATE
                    SET schema_name = EXCLUDED.schema_name,
                        display_name = EXCLUDED.display_name,
                        active = EXCLUDED.active,
                        updated_at = CURRENT_TIMESTAMP
                    """)) {
                ps.setString(1, tenantId);
                ps.setString(2, schema);
                ps.setString(3, tenantId);
                ps.executeUpdate();
            }
        }
    }

    @Transactional(Transactional.TxType.REQUIRES_NEW)
    protected void saveDefaultSettingsInTenantSchema(String tenantId, String schema) {
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

    private String q(String ident) {
        return "\"" + ident.replace("\"", "\"\"") + "\"";
    }
}