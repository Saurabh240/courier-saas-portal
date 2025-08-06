package com.courier.app.orders.model;

public record OrderUpdateRequest(
        String senderName,
        String receiverName,
        String pickupAddress,
        String deliveryAddress,
        Double packageWeightKg,
        Double packageLengthCm,
        Double packageWidthCm,
        Double packageHeightCm,
        String pickupPhone,
        String deliveryPhone,
        String pickupTimeWindow,
        String specialInstructions,
        Boolean isFragile,
        DeliveryType deliveryType
) {}
