package com.courier.app.payment.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component   // makes it a Spring bean
@ConfigurationProperties(prefix = "payment")
public class PaymentProperties {

    private Razorpay razorpay = new Razorpay();
    private Stripe stripe = new Stripe();

    @Data
    public static class Razorpay {
        private String keyId;
        private String keySecret;
        private String webhookSecret;
    }

    @Data
    public static class Stripe {
        private String secretKey;
        private String publishableKey;
        private String webhookSecret;
    }
}
