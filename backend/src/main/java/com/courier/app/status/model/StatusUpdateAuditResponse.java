package com.courier.app.status.model;
import com.courier.app.orders.model.OrderStatus;
import java.time.LocalDateTime;

public record StatusUpdateAuditResponse(Long id, Long orderId, OrderStatus oldStatus, OrderStatus newStatus, String performedBy, String reason, LocalDateTime timestamp) {}

