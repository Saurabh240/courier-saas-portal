package com.courier.app.payment.model;

public record VerifyPaymentRequest(
        String provider,       // e.g. "razorpay", "stripe"
        String orderId,        // provider-specific order id
        String paymentId,      // provider-specific payment id (if available)
        String signature       // signature or client_secret (varies by provider)
) {}
