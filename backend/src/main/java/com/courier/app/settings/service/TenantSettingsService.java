package com.courier.app.settings.service;

import com.courier.app.settings.dto.TenantSettingsDTO;

import java.sql.SQLException;
import java.util.Map;

public interface TenantSettingsService {

    TenantSettingsDTO getSettingsForCurrentTenant();

    TenantSettingsDTO updateSettings(TenantSettingsDTO dto);

    TenantSettingsDTO patchSettings(Map<String, Object> updates);

    void deleteSettingsForCurrentTenant();

    void createTenant(String tenantId) throws SQLException;
}