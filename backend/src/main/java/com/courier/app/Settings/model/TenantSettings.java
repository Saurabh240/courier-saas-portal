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
    @Column(name = "tenant_id", nullable = false, unique = true)
    private String tenantId;
    @Column(name = "business_hours", columnDefinition = "TEXT")
    private String businessHours;
    @Column(name = "brand_name")
    private String brandName;
    @Column(name = "logo_url")
    private String logoUrl;
    @Column(name = "primary_color")
    private String primaryColor;
    @Column(name = "secondary_color")
    private String secondaryColor;
    private String timezone;
    @Column(name = "created_at")
    private Instant createdAt;
    @Column(name = "updated_at")
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
