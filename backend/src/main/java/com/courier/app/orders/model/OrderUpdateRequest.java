package com.courier.app.orders.model;

import lombok.Data;

@Data
public class OrderUpdateRequest {
    private String senderName;
    private String receiverName;
    private String pickupAddress;
    private String deliveryAddress;
    private Double packageWeightKg;
    private Double packageLengthCm;
    private Double packageWidthCm;
    private Double packageHeightCm;
    private String pickupPhone;
    private String deliveryPhone;
    private String pickupTimeWindow;
    private String specialInstructions;
    private Boolean isFragile;
    private DeliveryType deliveryType;
}
