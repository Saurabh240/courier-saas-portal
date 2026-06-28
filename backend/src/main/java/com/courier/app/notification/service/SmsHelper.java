package com.courier.app.notification.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsHelper {

    @Value("${twilio.account-sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth-token}")
    private String twilioAuthToken;

    @Value("${twilio.phone-number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        Twilio.init(twilioAccountSid, twilioAuthToken);
        log.info("Twilio initialized with account SID: {}", twilioAccountSid);
    }

    public boolean sendSms(String toNumber, String body) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    body
            ).create();
            log.info("Twilio SMS sent successfully. SID: {}", message.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send SMS via Twilio: {}", e.getMessage());
            return false;
        }
    }
}