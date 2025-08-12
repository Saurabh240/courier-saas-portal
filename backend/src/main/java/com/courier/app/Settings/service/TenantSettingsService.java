package com.courier.app.Settings.service;

import com.courier.app.Settings.dto.TenantSettingsDTO;

import java.util.UUID;

public interface TenantSettingsService {
    TenantSettingsDTO getSettingsForCurrentTenant();
    TenantSettingsDTO saveOrUpdateSettings(TenantSettingsDTO dto);
    void deleteSettingsForCurrentTenant();
    void createTenant(String tenantId);
}
