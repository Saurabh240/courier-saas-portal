package com.courier.app.settings.service.impl;

import com.courier.app.settings.dto.NotificationSettingsDTO;
import com.courier.app.settings.model.TenantSettings;
import com.courier.app.settings.repository.TenantSettingsRepository;
import com.courier.app.usermgmt.multiTenancy.TenantContext;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

@Slf4j
@Service
public class NotificationSettingsServiceImpl implements NotificationSettingsService {

    private final TenantSettingsRepository repository;
    private final AesEncryptionService     aes;

    // ── Global fallback credentials from application.properties ──────────────
    @Value("${sendgrid.api-key}")
    private String globalSendgridKey;

    @Value("${notification.email.from}")
    private String globalFromEmail;

    @Value("${twilio.account-sid}")
    private String globalTwilioSid;

    @Value("${twilio.auth-token}")
    private String globalTwilioToken;

    @Value("${twilio.phone-number}")
    private String globalTwilioFrom;

    // Use constructor injection only for non-@Value fields
    public NotificationSettingsServiceImpl(TenantSettingsRepository repository,
                                           AesEncryptionService aes) {
        this.repository = repository;
        this.aes        = aes;
    }

    // ── GET ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public NotificationSettingsDTO getNotificationSettings() {
        return toDto(currentSettings());
    }

    // ── PUT ───────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public NotificationSettingsDTO saveNotificationSettings(NotificationSettingsDTO dto) {
        TenantSettings s = currentSettings();

        s.setSmtpHost(dto.getSmtpHost());
        s.setSmtpPort(dto.getSmtpPort());
        s.setSmtpUser(dto.getSmtpUser());
        s.setSmtpTls(dto.getSmtpTls());
        s.setEmailEnabled(dto.getEmailEnabled());

        if (isNewSecret(dto.getSmtpPassword())) {
            s.setSmtpPasswordEnc(aes.encrypt(dto.getSmtpPassword()));
        }

        s.setTwilioAccountSid(dto.getTwilioAccountSid());
        s.setTwilioFromNumber(dto.getTwilioFromNumber());
        s.setSmsEnabled(dto.getSmsEnabled());

        if (isNewSecret(dto.getTwilioAuthToken())) {
            s.setTwilioAuthTokenEnc(aes.encrypt(dto.getTwilioAuthToken()));
        }

        repository.save(s);
        log.info("Notification settings updated for tenant '{}'", s.getTenantId());
        return toDto(s);
    }

    // ── Test email ────────────────────────────────────────────────────────────

    @Override
    public void sendTestEmail(String toEmail) {
        TenantSettings s = currentSettings();

        // Use tenant-specific key if configured, otherwise fall back to global
        String apiKey   = (s.getSmtpPasswordEnc() != null)
                ? aes.decrypt(s.getSmtpPasswordEnc())
                : globalSendgridKey;

        String fromEmail = (s.getSmtpUser() != null)
                ? s.getSmtpUser()
                : globalFromEmail;

        // emailEnabled check: skip if tenant has explicitly disabled it
        // (null means not configured yet → use global, so allow it)
        if (Boolean.FALSE.equals(s.getEmailEnabled())) {
            throw new IllegalStateException(
                    "Email notifications are disabled for this tenant. "
                            + "Enable via PUT /api/settings/notifications (emailEnabled: true).");
        }

        Email from   = new Email(fromEmail);
        Email to     = new Email(toEmail);
        Content body = new Content("text/plain",
                "This is a test email from Courier SaaS Portal (tenant: " + s.getTenantId() + ").\n\n"
                        + "If you received this, your email configuration is working correctly.");
        Mail mail = new Mail(from, "Test Email — Courier SaaS Portal", to, body);

        SendGrid sg     = new SendGrid(apiKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            if (response.getStatusCode() < 200 || response.getStatusCode() >= 300) {
                throw new RuntimeException(
                        "SendGrid rejected the request (HTTP " + response.getStatusCode()
                                + "): " + response.getBody());
            }
            log.info("Test email sent to '{}' for tenant '{}' (using {} credentials)",
                    toEmail, s.getTenantId(),
                    s.getSmtpPasswordEnc() != null ? "tenant" : "global");
        } catch (IOException e) {
            throw new RuntimeException("Failed to send test email via SendGrid: " + e.getMessage(), e);
        }
    }

    // ── Test SMS ──────────────────────────────────────────────────────────────

    @Override
    public void sendTestSms(String toPhone) {
        TenantSettings s = currentSettings();

        if (Boolean.FALSE.equals(s.getSmsEnabled())) {
            throw new IllegalStateException(
                    "SMS notifications are disabled for this tenant. "
                            + "Enable via PUT /api/settings/notifications (smsEnabled: true).");
        }

        // Use tenant-specific credentials if configured, otherwise fall back to global
        String sid       = (s.getTwilioAccountSid() != null)
                ? s.getTwilioAccountSid()
                : globalTwilioSid;

        String token     = (s.getTwilioAuthTokenEnc() != null)
                ? aes.decrypt(s.getTwilioAuthTokenEnc())
                : globalTwilioToken;

        String fromPhone = (s.getTwilioFromNumber() != null)
                ? s.getTwilioFromNumber()
                : globalTwilioFrom;

        // Build a dedicated RestClient with these credentials
        // This bypasses the global Twilio singleton which caches the first init
        com.twilio.http.TwilioRestClient client = new com.twilio.http.TwilioRestClient.Builder(sid, token)
                .build();
        log.info("Using Twilio SID: '{}', token length: {}, from: '{}'",
                sid, token.length(), fromPhone);
        Message message = Message.creator(
                new PhoneNumber(toPhone),
                new PhoneNumber(fromPhone),
                "Test SMS from Courier SaaS Portal (tenant: " + s.getTenantId() + "). "
                        + "If you received this, your SMS configuration is working correctly."
        ).create(client);  // pass the client explicitly

        log.info("Test SMS sent to '{}' for tenant '{}' (using {} credentials) — SID: {}",
                toPhone, s.getTenantId(),
                s.getTwilioAccountSid() != null ? "tenant" : "global",
                message.getSid());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private TenantSettings currentSettings() {
        String tenantId = TenantContext.getCurrentTenant();
        return repository.findByTenantId(tenantId)
                .orElseThrow(() -> new RuntimeException(
                        "Tenant settings not found for tenant: " + tenantId));
    }

    private boolean isNewSecret(String value) {
        return value != null && !value.isBlank() && !value.equals(AesEncryptionService.masked());
    }

    private NotificationSettingsDTO toDto(TenantSettings s) {
        NotificationSettingsDTO dto = new NotificationSettingsDTO();
        dto.setSmtpHost(s.getSmtpHost());
        dto.setSmtpPort(s.getSmtpPort());
        dto.setSmtpUser(s.getSmtpUser());
        dto.setSmtpPassword(s.getSmtpPasswordEnc() != null ? AesEncryptionService.masked() : null);
        dto.setSmtpTls(s.getSmtpTls());
        dto.setEmailEnabled(s.getEmailEnabled());
        dto.setTwilioAccountSid(s.getTwilioAccountSid());
        dto.setTwilioAuthToken(s.getTwilioAuthTokenEnc() != null ? AesEncryptionService.masked() : null);
        dto.setTwilioFromNumber(s.getTwilioFromNumber());
        dto.setSmsEnabled(s.getSmsEnabled());
        return dto;
    }
}