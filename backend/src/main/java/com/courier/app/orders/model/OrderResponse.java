package com.courier.app.orders.model;

import java.time.LocalDateTime;

public record OrderResponse(Long id, String customerEmail, String senderName, String receiverName, String pickupAddress, String deliveryAddress, OrderStatus status, String assignedPartnerEmail, LocalDateTime createdAt,
                            String proofPath, String packageType, int packageWeightKg, int packageHeightCm,
                            int packageLengthCm, int packageWidthCm, String pickupPhone, String deliveryPhone,
                            Object o, String deliveryProofPath) {}