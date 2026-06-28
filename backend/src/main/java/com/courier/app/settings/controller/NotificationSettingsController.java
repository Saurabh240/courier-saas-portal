package com.courier.app.settings.controller;

import com.courier.app.settings.dto.NotificationSettingsDTO;
import com.courier.app.settings.service.impl.NotificationSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Per-tenant SMTP (SendGrid) and Twilio notification configuration.
 * All endpoints are ADMIN only.
 *
 * Base path: /api/settings/notifications
 */
@RestController
@RequestMapping("/api/settings/notifications")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Notification Settings", description = "Per-tenant SMTP and Twilio notification configuration (ADMIN only)")
@SecurityRequirement(name = "bearerAuth")
public class NotificationSettingsController {

    private final NotificationSettingsService service;

    /**
     * Returns the current tenant's SMTP and Twilio configuration.
     * Passwords and tokens are always masked (••••••••) in the response.
     */
    @GetMapping
    @Operation(
            summary     = "Get notification settings",
            description = "Returns the current tenant's SMTP and Twilio configuration. "
                    + "Passwords and tokens are masked (••••••••) — never returned in plaintext."
    )

    public NotificationSettingsDTO getSettings() {
        return service.getNotificationSettings();
    }

    /**
     * Saves SMTP and Twilio credentials for the current tenant.
     * Passwords/tokens are AES-256 encrypted before storage.
     * Omit or send null for password/token fields to keep existing values unchanged.
     */
    @PutMapping
    @Operation(
            summary     = "Save notification settings",
            description = "Persists SMTP and Twilio credentials for the current tenant. "
                    + "Passwords/tokens are AES-256 encrypted before storage. "
                    + "Omit or send null for password/token fields to keep existing values."
    )

    public NotificationSettingsDTO saveSettings(@RequestBody NotificationSettingsDTO dto) {
        return service.saveNotificationSettings(dto);
    }

    /**
     * Sends a test email to the given address using the tenant's stored
     * SendGrid API key and from-address. Requires emailEnabled = true.
     */
    @PostMapping("/test-email")
    @Operation(
            summary     = "Send a test email",
            description = "Sends a test email to the specified address using the tenant's stored "
                    + "SendGrid API key and from-address. Requires emailEnabled = true and "
                    + "smtpUser + smtpPassword (SendGrid API key) to be configured."
    )
    public ResponseEntity<String> testEmail(@RequestParam String toEmail) {
        service.sendTestEmail(toEmail);
        return ResponseEntity.ok("Test email sent successfully to: " + toEmail);
    }

    /**
     * Sends a test SMS to the given phone number using the tenant's stored
     * Twilio credentials. Requires smsEnabled = true.
     * Phone number must be in E.164 format (e.g. +919876543210).
     */
    @PostMapping("/test-sms")
    @Operation(
            summary     = "Send a test SMS",
            description = "Sends a test SMS to the specified phone number using the tenant's stored "
                    + "Twilio credentials. Requires smsEnabled = true and twilioAccountSid, "
                    + "twilioAuthToken, twilioFromNumber to be configured. "
                    + "Phone number must be in E.164 format (e.g. +919876543210)."
    )

    public ResponseEntity<String> testSms(@RequestParam String toPhone) {
        service.sendTestSms(toPhone);
        return ResponseEntity.ok("Test SMS sent successfully to: " + toPhone);
    }
}