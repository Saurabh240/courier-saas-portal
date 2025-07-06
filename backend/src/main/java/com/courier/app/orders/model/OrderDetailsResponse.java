package com.courier.app.orders.model;

import java.time.LocalDateTime;

public record OrderDetailsResponse(
        Long id,
        String customerEmail,
        String senderName,
        String receiverName,
        String pickupAddress,
        String deliveryAddress,
        PackageType packageType,
        double packageWeightKg,
        double packageLengthCm,
        double packageWidthCm,
        double packageHeightCm,
        String pickupPhone,
        String deliveryPhone,
        String pickupDate,
        String pickupTimeWindow,
        String specialInstructions,
        PaymentMode paymentMode,
        double declaredValue,
        boolean isFragile,
        OrderStatus status,
        DeliveryType deliveryType,
        InvoiceStatus invoiceStatus,
        String assignedPartnerEmail,
        LocalDateTime createdAt,
        String deliveryProofPath
) {}
