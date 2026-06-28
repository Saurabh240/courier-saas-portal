package com.courier.app.settings.model;

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

    // ── SMTP (per-tenant outbound email) ─────────────────────────────────────
    @Column(name = "smtp_host")
    private String smtpHost;
    @Column(name = "smtp_port")
    private Integer smtpPort;
    @Column(name = "smtp_user")
    private String smtpUser;
    /** AES-256 encrypted SMTP password (base64-encoded ciphertext). */
    @Column(name = "smtp_password_enc")
    private String smtpPasswordEnc;
    @Column(name = "smtp_tls")
    private Boolean smtpTls;
    @Column(name = "email_enabled")
    private Boolean emailEnabled;

    // ── Twilio (per-tenant SMS) ───────────────────────────────────────────────
    @Column(name = "twilio_account_sid")
    private String twilioAccountSid;
    /** AES-256 encrypted Twilio auth token (base64-encoded ciphertext). */
    @Column(name = "twilio_auth_token_enc")
    private String twilioAuthTokenEnc;
    @Column(name = "twilio_from_number")
    private String twilioFromNumber;
    @Column(name = "sms_enabled")
    private Boolean smsEnabled;

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