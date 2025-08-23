package com.courier.app.settings.service;

import com.courier.app.settings.dto.TenantSettingsDTO;

import java.sql.SQLException;

public interface TenantSettingsService {
    TenantSettingsDTO getSettingsForCurrentTenant();
    TenantSettingsDTO saveOrUpdateSettings(TenantSettingsDTO dto);
    void deleteSettingsForCurrentTenant();
    void createTenant(String tenantId) throws SQLException;
}
