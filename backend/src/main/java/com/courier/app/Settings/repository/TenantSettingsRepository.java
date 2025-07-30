package com.courier.app.Settings.repository;

import com.courier.app.Settings.model.TenantSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TenantSettingsRepository extends JpaRepository<TenantSettings, UUID> {
    Optional<TenantSettings> findByTenantId(UUID tenantId);
    void deleteByTenantId(UUID tenantId);
    boolean existsByTenantId(UUID tenantId);
}
