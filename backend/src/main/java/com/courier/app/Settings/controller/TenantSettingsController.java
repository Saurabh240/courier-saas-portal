package com.courier.app.Settings.controller;

import com.courier.app.Settings.dto.TenantSettingsDTO;
import com.courier.app.Settings.service.TenantSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
public class TenantSettingsController {

    private final TenantSettingsService service;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public TenantSettingsDTO getSettings() {
        return service.getSettingsForCurrentTenant();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    public TenantSettingsDTO updateSettings(@RequestBody TenantSettingsDTO dto) {
        return service.saveOrUpdateSettings(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public TenantSettingsDTO createSettings(@RequestBody TenantSettingsDTO dto) {
        return service.saveOrUpdateSettings(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping
    public void deleteSettings() {
        service.deleteSettingsForCurrentTenant();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping("/tenants")
    public String createTenant(@RequestParam String tenantId) {
        service.createTenant(tenantId);
        return "Tenant '" + tenantId + "' created successfully.";
    }

}
