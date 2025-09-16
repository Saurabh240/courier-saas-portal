package com.courier.app.payment.model;

public record CreatePaymentOrderResponse(
        String orderId,         // provider order id
        String keyId,           // client needs this to complete checkout
        double amount
) {}
