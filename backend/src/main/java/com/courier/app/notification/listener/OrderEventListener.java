package com.courier.app.notification.listener;

import com.courier.app.notification.model.Channel;
import com.courier.app.notification.model.NotificationEvent;
import com.courier.app.notification.model.UserContactInfo;
import com.courier.app.notification.service.NotificationService;
import com.courier.app.orders.events.OrderCreatedEvent;
import com.courier.app.orders.events.OrderStatusUpdatedEvent;
import com.courier.app.orders.model.Order;
import com.courier.app.usermgmt.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderEventListener {

    private final NotificationService notificationService;

    @Value("${notification.email.enabled:true}")
    private boolean emailEnabled;

    @Value("${notification.sms.enabled:false}")
    private boolean smsEnabled;

    @EventListener
    public void handleOrderCreated(OrderCreatedEvent event) {
        sendNotification(event.getOrder(), "ORDER_CREATED");
    }

    @EventListener
    public void handleOrderStatusUpdated(OrderStatusUpdatedEvent event) {
        sendNotification(event.getOrder(), "ORDER_STATUS_UPDATED");
    }

    private void sendNotification(Order order, String type) {
        UserContactInfo user = new UserContactInfo(order.getCustomerEmail(),order.getPickupPhone());

        if (emailEnabled) {
            NotificationEvent emailEvent = new NotificationEvent(
                    (order.getId()),
                    Channel.EMAIL,
                    type,
                    user,
                    order.getStatus()
            );
            notificationService.processNotification(emailEvent);
        }

        if (smsEnabled) {
            NotificationEvent smsEvent = new NotificationEvent(
                    (order.getId()),
                    Channel.SMS,
                    type,
                    user,
                    order.getStatus()
            );
            notificationService.processNotification(smsEvent);
        }
    }
}
