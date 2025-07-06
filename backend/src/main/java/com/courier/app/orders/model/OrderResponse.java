package com.courier.app.orders.model;

public record OrderResponse(
        Long orderId,
        String senderName,
        String receiverName,
        String pickupAddress,
        String deliveryAddress,
        PaymentMode paymentMode,
        double declaredValue,
        DeliveryType deliveryType,
        OrderStatus status,
        String invoiceStatus
) {}
