package com.courier.app.orders.events;

import com.courier.app.orders.model.Order;

public class OrderCreatedEvent {
    private final Order order;
    public OrderCreatedEvent(Order order) {
        this.order = order;
    }
    public Order getOrder() {
        return order;
    }
}