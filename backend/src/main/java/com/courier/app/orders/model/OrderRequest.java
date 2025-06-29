package com.courier.app.orders.model;

public record OrderRequest(String customerEmail, String senderName, String receiverName, String pickupAddress, String deliveryAddress, PackageType packageType,double packageWeightKg,int packageLengthCm,int packageWidthCm,int packageHeightCm,
                           String pickupPhone,String deliveryPhone,String pickupDate,String pickupTimeWindow,String specialInstructions,PaymentMode  paymentMode,double declaredValue,Boolean isFragile,  DeliveryType deliveryType) {}