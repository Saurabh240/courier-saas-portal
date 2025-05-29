package com.courier.app.orders.model;

public record OrderRequest(String customerEmail, String senderName, String receiverName, String pickupAddress, String deliveryAddress) {}