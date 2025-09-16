package com.courier.app.payment.config;

import com.razorpay.RazorpayClient;
import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfig {

    private final PaymentProperties properties;

    public PaymentConfig(PaymentProperties properties) {
        this.properties = properties;
    }

    @Bean
    public RazorpayClient razorpayClient() throws Exception {
        return new RazorpayClient(
                properties.getRazorpay().getKeyId(),
                properties.getRazorpay().getKeySecret()
        );
    }

    @PostConstruct
    public void stripeInit() {
        Stripe.apiKey = properties.getStripe().getSecretKey();
    }
}
