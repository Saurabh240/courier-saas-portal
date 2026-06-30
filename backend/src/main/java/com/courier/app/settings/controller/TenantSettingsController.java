package com.courier.app.settings.controller;

import com.courier.app.settings.dto.TenantSettingsDTO;
import com.courier.app.settings.service.TenantSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.Map;

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
    public TenantSettingsDTO updateSettings(@Valid @RequestBody TenantSettingsDTO dto) {
        return service.updateSettings(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping
    public TenantSettingsDTO patchSettings(@RequestBody Map<String, Object> updates) {
        return service.patchSettings(updates);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping
    public void deleteSettings() {
        service.deleteSettingsForCurrentTenant();
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    @PostMapping("/tenants")
    public String createTenant(@RequestParam String tenantId) throws SQLException {
        service.createTenant(tenantId);
        return "Tenant '" + tenantId + "' created successfully.";
    }
}