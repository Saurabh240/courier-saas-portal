package com.courier.app.orders.model;

public record OrderRequest(String customerEmail, String senderName, String receiverName, String pickupAddress, String deliveryAddress,String packageType,int packageWeightKg,int packageLengthCm,int packageWidthCm,int packageHeightCm,
                           String pickupPhone,String deliveryPhone,String pickupDate,String pickupTimeWindow,String specialInstructions,String paymentMode,double declaredValue,Boolean isFragile,String deliveryType) {}