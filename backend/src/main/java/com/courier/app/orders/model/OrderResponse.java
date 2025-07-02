package com.courier.app.orders.model;

import java.time.LocalDateTime;

public record OrderResponse(Long id, String customerEmail, String senderName, String receiverName, String pickupAddress,
                            String deliveryAddress, OrderStatus status, String assignedPartnerEmail,
                            LocalDateTime createdAt,
                            PackageType packageType, double packageWeightKg, double packageHeightCm,
                            double packageLengthCm, double packageWidthCm, String pickupPhone, String deliveryPhone,
                            double declaredValue, boolean isFragile, String deliveryProofPath) {
}