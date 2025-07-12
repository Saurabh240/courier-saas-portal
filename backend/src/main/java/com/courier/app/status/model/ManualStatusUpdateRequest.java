package com.courier.app.status.model;
import com.courier.app.orders.model.OrderStatus;

public record ManualStatusUpdateRequest(Long orderId, OrderStatus status, String comment) {}

