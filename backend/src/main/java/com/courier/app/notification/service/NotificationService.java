package com.courier.app.notification.service;

import com.courier.app.notification.model.NotificationEvent;


public interface NotificationService {
    void processNotification(NotificationEvent event);
}
