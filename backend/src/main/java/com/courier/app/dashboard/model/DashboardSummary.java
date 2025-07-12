package com.courier.app.dashboard.model;

import com.courier.app.orders.model.OrderStatus;
import java.util.Map;

public record DashboardSummary(long totalOrders, long delivered, long inTransit, long createdToday, Map<OrderStatus, Long> statusCountMap) {}