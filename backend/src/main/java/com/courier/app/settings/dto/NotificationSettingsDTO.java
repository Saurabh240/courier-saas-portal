package com.courier.app.settings.dto;

import lombok.Data;

/**
 * Request/response DTO for per-tenant notification settings.
 * On GET responses, {@code smtpPassword} and {@code twilioAuthToken} are
 * masked ("••••••••") — they are never returned in plaintext.
 * On PUT requests, supply plaintext values; they will be AES-256 encrypted
 * before persisting. Omit/null a password field on PUT to leave the stored
 * value unchanged.
 */
@Data
public class NotificationSettingsDTO {

    // ── SMTP ────────────────────────────────────────────────────────────────
    private String smtpHost;
    private Integer smtpPort;
    private String smtpUser;
    /** Plaintext on PUT. Masked ("••••••••") on GET. Never stored in plaintext. */
    private String smtpPassword;
    private Boolean smtpTls;
    private Boolean emailEnabled;

    // ── Twilio ──────────────────────────────────────────────────────────────
    private String twilioAccountSid;
    /** Plaintext on PUT. Masked ("••••••••") on GET. Never stored in plaintext. */
    private String twilioAuthToken;
    private String twilioFromNumber;
    private Boolean smsEnabled;
}