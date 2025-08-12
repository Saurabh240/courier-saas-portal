package com.courier.app.Settings.service.impl;

import com.courier.app.Settings.config.TenantDefaultProperties;
import com.courier.app.Settings.dto.TenantSettingsDTO;
import com.courier.app.Settings.model.TenantSettings;
import com.courier.app.Settings.repository.TenantSettingsRepository;
import com.courier.app.Settings.service.TenantSettingsService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class TenantSettingsServiceImpl implements TenantSettingsService {

    @PersistenceContext
    private EntityManager entityManager;

    private final TenantSettingsRepository repository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final TenantDefaultProperties defaultProperties;

    @Override
    public TenantSettingsDTO getSettingsForCurrentTenant() {
        UUID tenantId = getCurrentTenantId();
        TenantSettings settings = repository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException("Settings not found"));
        return toDto(settings);
    }

    @Override
    public TenantSettingsDTO saveOrUpdateSettings(TenantSettingsDTO dto) {
        UUID tenantId = getCurrentTenantId();
        validateSettings(dto);
        TenantSettings entity = repository.findByTenantId(tenantId).orElse(new TenantSettings());
        entity.setTenantId(tenantId);
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
        UUID tenantId = getCurrentTenantId();
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

    private UUID getCurrentTenantId() {
        // TODO: Replace this with real tenant extraction from security context or token
        return UUID.fromString("00000000-0000-0000-0000-000000000001");
    }

    @Transactional
    public void createTenant(UUID tenantId) {
        // Create schema for this tenant
        entityManager.createNativeQuery("CREATE SCHEMA IF NOT EXISTS " + tenantId).executeUpdate();
        // Create and save default settings
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


}

