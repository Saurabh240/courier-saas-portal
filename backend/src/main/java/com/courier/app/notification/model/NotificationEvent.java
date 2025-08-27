package com.courier.app.notification.model;

import com.courier.app.orders.model.OrderStatus;
import com.courier.app.usermgmt.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private Long orderId;
    private Channel channel;
    private String type;
    private UserContactInfo user;
    private OrderStatus status;


}
