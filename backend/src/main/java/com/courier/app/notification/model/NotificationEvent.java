package com.courier.app.notification.model;

import com.courier.app.orders.model.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private Long orderId;
    private Channel channel;     // EMAIL, SMS
    private String type;         // ORDER_CREATED or ORDER_STATUS_UPDATED
    private Customer customer;
    private OrderStatus status;       //  DELIVERED


    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Customer {
        private String email;
        private String phone;
    }
}
