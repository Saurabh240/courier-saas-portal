package com.courier.app.status.model;
import com.courier.app.orders.model.OrderStatus;
import java.time.LocalDateTime;

public record ManualStatusUpdateResponse(Long id, Long orderId, OrderStatus status, String comment, String updatedBy, LocalDateTime timestamp) {}
