package com.courier.app.Settings.service;

import com.courier.app.Settings.dto.TenantSettingsDTO;

public interface TenantSettingsService {
    TenantSettingsDTO getSettingsForCurrentTenant();
    TenantSettingsDTO saveOrUpdateSettings(TenantSettingsDTO dto);
    void deleteSettingsForCurrentTenant();
}
