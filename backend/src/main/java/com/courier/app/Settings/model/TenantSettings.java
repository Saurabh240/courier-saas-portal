package com.courier.app.Settings.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tenant_settings")
@Getter
@Setter
public class TenantSettings {

    @Id
    @GeneratedValue
    private UUID id;
    @Column(nullable = false, unique = true)
    private UUID tenantId;
    @Column(columnDefinition = "TEXT")
    private String businessHours;
    private String brandName;
    private String logoUrl;
    private String primaryColor;
    private String secondaryColor;
    private String timezone;
    private Instant createdAt;
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
