package com.courier.app.notification.controller;

import com.courier.app.notification.model.NotificationEvent;
import com.courier.app.notification.model.NotificationLog;
import com.courier.app.notification.repository.NotificationLogRepository;
import com.courier.app.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final NotificationLogRepository notificationLogRepository;

    @PostMapping("/send")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public void sendNotification(@RequestBody NotificationEvent event) {
        notificationService.processNotification(event);
    }

    @GetMapping("/logs")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<NotificationLog> getAllLogs() {
        return notificationLogRepository.findAll();
    }
}
