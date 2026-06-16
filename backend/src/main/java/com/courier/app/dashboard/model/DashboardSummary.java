package com.courier.app.dashboard.model;

import com.courier.app.orders.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record DashboardSummary
        (
                long totalOrders,
                long pendingOrders,
                long inTransitOrders,
                long deliveredOrders,
                long cancelledOrders,
                BigDecimal revenueThisMonth,
                double deliverySuccessRate,
                List<DailyOrderCount> weeklyOrderCounts,
                Map<OrderStatus, StatusBreakdown> statusBreakdown
        )
 {}
