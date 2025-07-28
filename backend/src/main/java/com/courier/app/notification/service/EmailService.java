package com.courier.app.notification.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
public class EmailService {

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    public boolean sendEmail(String toEmail, String subject, String body) {
        Email from = new Email("no-reply@courierapp.com");
        Email to = new Email(toEmail);
        Content content = new Content("text/plain", body);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            log.info("Email sent: StatusCode={}, Body={}", response.getStatusCode(), response.getBody());
            return response.getStatusCode() >= 200 && response.getStatusCode() < 300;
        } catch (IOException e) {
            log.error("Failed to send email: {}", e.getMessage(), e);
            return false;
        }
    }
}
