package com.courier.app.notification.service;

import com.courier.app.notification.model.Channel;
import com.courier.app.notification.model.NotificationEvent;
import com.courier.app.notification.model.NotificationLog;
import com.courier.app.notification.model.NotificationStatus;
import com.courier.app.notification.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    @Value("${notification.email.enabled:true}")
    private boolean emailEnabled;
    @Value("${notification.sms.enabled:false}")
    private boolean smsEnabled;
    private final NotificationLogRepository notificationLogRepository;
    private final EmailService emailService;
    private final SmsHelper smsHelper;

    @Override
    public void processNotification(NotificationEvent event) {
        // EMAIL
        if (emailEnabled && event.getUser().getEmail() != null) {
            String subject = "Your order " + event.getOrderId() + " is now " + event.getStatus();
            String name = event.getUser().getName() != null ? event.getUser().getName() : "User";
            String body = "Dear"+name+ ",\n\nYour order #" + event.getOrderId() +
                    " is now " + event.getStatus() + ".\n\nThank you,\nCourier App";

            boolean success = false;
            String error = null;
            try {
                success = emailService.sendEmail(event.getUser().getEmail(), subject, body);
            } catch (Exception ex) {
                try {
                    success = emailService.sendEmail(event.getUser().getEmail(), subject, body);
                } catch (Exception retryEx) {
                    error = retryEx.getMessage();
                }
            }

            NotificationLog log = new NotificationLog();
            log.setOrderId(event.getOrderId());
            log.setChannel(Channel.EMAIL);
            log.setStatus(success ? NotificationStatus.SENT : NotificationStatus.FAILED);
            log.setAttemptedAt(Instant.now());
            log.setErrorMessage(success ? null : error != null ? error : "Unknown error");
            notificationLogRepository.save(log);
        }

        // SMS
        if (smsEnabled && event.getChannel() == Channel.SMS && event.getUser().getPhoneNo() != null) {
            String smsBody = "Courier Update: Order #" + event.getOrderId() + " is now " + event.getStatus() + ".";

            boolean success = false;
            String error = null;

            int attempts = 0;
            int maxRetries = 3;

            while (attempts < maxRetries && !success) {
                try {
                    smsHelper.sendSms(event.getUser().getPhoneNo(), smsBody);
                    success = true;
                } catch (Exception ex) {
                    error = ex.getMessage(); // Capture latest error
                    attempts++;
                }
            }

            NotificationLog log = new NotificationLog();
            log.setOrderId(event.getOrderId());
            log.setChannel(Channel.SMS);
            log.setStatus(success ? NotificationStatus.SENT : NotificationStatus.FAILED);
            log.setAttemptedAt(Instant.now());
            log.setErrorMessage(success ? null : (error != null ? error : "Unknown error"));
            notificationLogRepository.save(log);
        }

    }
}