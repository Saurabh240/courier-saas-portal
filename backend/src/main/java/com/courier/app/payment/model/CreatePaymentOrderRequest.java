package com.courier.app.payment.model;

public record CreatePaymentOrderRequest(
        Long orderId,
        double amount

) {}
