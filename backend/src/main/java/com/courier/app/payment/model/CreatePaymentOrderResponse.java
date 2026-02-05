package com.courier.app.payment.model;

public record CreatePaymentOrderResponse(
        String orderId,     // Razorpay order_id
        String keyId,       // Public key for checkout
        double amount,      // Amount in INR (or smallest unit)
        String currency,    // e.g. "INR"
        String status       // e.g. "created"
) {}
