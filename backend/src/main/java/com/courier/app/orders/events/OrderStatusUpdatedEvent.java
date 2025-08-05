package com.courier.app.orders.events;

import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderStatus;

public class OrderStatusUpdatedEvent {
    private final Order order;
    private final OrderStatus oldStatus;
    public OrderStatusUpdatedEvent(Order order, OrderStatus oldStatus) {
        this.order = order;
        this.oldStatus = oldStatus;
    }
    public Order getOrder() {
        return order;
    }
    public OrderStatus getOldStatus() {
        return oldStatus;
    }
}