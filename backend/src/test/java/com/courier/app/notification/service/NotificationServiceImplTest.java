/*
package com.courier.app.notification.service;

import com.courier.app.notification.model.*;
import com.courier.app.notification.repository.NotificationLogRepository;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.usermgmt.model.Role;
import com.courier.app.usermgmt.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import java.lang.reflect.Field;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.doThrow;

class NotificationServiceImplTest {

    @Mock
    private EmailService emailService;
    @Mock
    private SmsHelper smsHelper;
    @Mock
    private NotificationLogRepository logRepository;
    @InjectMocks
    private NotificationServiceImpl notificationService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        // Set emailEnabled = true
        Field emailEnabledField = NotificationServiceImpl.class.getDeclaredField("emailEnabled");
        emailEnabledField.setAccessible(true);
        emailEnabledField.set(notificationService, true);
        // Set smsEnabled = true
        Field smsEnabledField = NotificationServiceImpl.class.getDeclaredField("smsEnabled");
        smsEnabledField.setAccessible(true);
        smsEnabledField.set(notificationService, true);
    }

    @Test
    void testProcessNotification_emailSuccess() {
        // Arrange
        User customer = new User("Staff", "staff@example.com","Staff@123", "1234567890", Role.STAFF);
        NotificationEvent event = new NotificationEvent(1L, Channel.EMAIL, "ORDER_CREATED", customer, OrderStatus.CREATED);
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenReturn(true);
        // Act
        notificationService.processNotification(event);
        // Assert
        verify(emailService, times(1)).sendEmail(eq("test@example.com"), anyString(), anyString());
        verify(logRepository, times(1)).save(any(NotificationLog.class));
    }

    @Test
    void testProcessNotification_smsSuccess() {
        // Arrange
        User user = new User("Staff", "staff@example.com","Staff@123", "1234567890", Role.STAFF);
        NotificationEvent event = new NotificationEvent(2L, Channel.SMS, "ORDER_STATUS_UPDATED", user, OrderStatus.PICKED_UP);
        // Correct for non-void method
        when(smsHelper.sendSms(eq("+1234567890"), anyString())).thenReturn(true);
        // Act
        notificationService.processNotification(event);
        // Assert
        verify(smsHelper, times(1)).sendSms(eq("+1234567890"), anyString());
        verify(logRepository, times(1)).save(any(NotificationLog.class));
    }
    @Test
    void testProcessNotification_emailFailsWithRetries() {
        // Arrange
        User user = new User("Staff", "staff@example.com","Staff@123", "1234567890", Role.STAFF);
        NotificationEvent event = new NotificationEvent(3L, Channel.EMAIL, "ORDER_FAILED", user, OrderStatus.DELIVERED); // Use any existing enum
        // Simulate email failure on both attempts
        when(emailService.sendEmail(anyString(), anyString(), anyString())).thenThrow(new RuntimeException("Email failed"));
        // Act
        notificationService.processNotification(event);
        // Assert
        verify(emailService, times(2)).sendEmail(eq("fail@example.com"), anyString(), anyString());
        verify(logRepository, times(1)).save(argThat(log ->
                log.getChannel() == Channel.EMAIL &&
                        log.getStatus() == NotificationStatus.FAILED &&
                        log.getErrorMessage().equals("Email failed")
        ));
    }

    @Test
    void testProcessNotification_smsFailsWithRetries() {
        // Arrange
        User user = new User("Staff", "staff@example.com","Staff@123", "1234567890", Role.STAFF);
        NotificationEvent event = new NotificationEvent(4L, Channel.SMS, "ORDER_STATUS_UPDATED", user, OrderStatus.PICKED_UP);
        // Simulate all 3 attempts failing
        doThrow(new RuntimeException("SMS failed"))
                .when(smsHelper).sendSms(eq("+9876543210"), anyString());
        // Act
        notificationService.processNotification(event);
        // Assert: 3 attempts
        verify(smsHelper, times(3)).sendSms(eq("+9876543210"), anyString());
        verify(logRepository, times(1)).save(argThat(log ->
                log.getStatus() == NotificationStatus.FAILED && log.getChannel() == Channel.SMS
        ));
    }

}
*/
