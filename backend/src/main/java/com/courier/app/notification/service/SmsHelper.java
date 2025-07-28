package com.courier.app.notification.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsHelper {

    @Value("${twilio.phone-number}")
    private String twilioPhoneNumber;

    public boolean sendSms(String to, String body) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(to),
                    new PhoneNumber(twilioPhoneNumber),
                    body
            ).create();
            log.info("Twilio SMS sent successfully. SID: {}", message.getSid());
            return true;
        } catch (Exception e) {
            log.error("Failed to send SMS via Twilio", e);
            return false;
        }
    }
}
