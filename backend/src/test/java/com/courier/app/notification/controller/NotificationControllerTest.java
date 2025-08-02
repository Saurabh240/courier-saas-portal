package com.courier.app.notification.controller;

import com.courier.app.notification.testConfig.TestSecurityConfig;
import com.courier.app.notification.model.*;
import com.courier.app.notification.model.NotificationEvent.Customer;
import com.courier.app.notification.repository.NotificationLogRepository;
import com.courier.app.notification.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import java.time.Instant;
import java.util.List;

@WebMvcTest(NotificationController.class)
@Import(TestSecurityConfig.class)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NotificationService notificationService;

    @MockBean
    private NotificationLogRepository notificationLogRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void sendNotification_asAdmin_returnsOk() throws Exception {
        NotificationEvent event = new NotificationEvent(
                1L,
                Channel.EMAIL,
                "ORDER_CREATED",
                new NotificationEvent.Customer("user@example.com", "9876543210"),
                com.courier.app.orders.model.OrderStatus.CREATED
        );

        mockMvc.perform(post("/api/notifications/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isOk());

        Mockito.verify(notificationService).processNotification(any(NotificationEvent.class));
    }

    @Test
    @WithMockUser(roles = {"STAFF"})
    void sendNotification_asStaff_returnsOk() throws Exception {
        NotificationEvent event = new NotificationEvent(
                2L,
                Channel.SMS,
                "ORDER_STATUS_UPDATED",
                new Customer("staff@example.com", "1234567890"),
                com.courier.app.orders.model.OrderStatus.DELIVERED
        );

        mockMvc.perform(post("/api/notifications/send")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(event)))
                .andExpect(status().isOk());

        Mockito.verify(notificationService).processNotification(any(NotificationEvent.class));
    }

    @Test
    @WithMockUser(roles = {"ADMIN"})
    void getAllLogs_returnsLogList() throws Exception {
        List<NotificationLog> logs = List.of(
                NotificationLog.builder()
                        .id(1L)
                        .orderId(1001L)
                        .channel(Channel.EMAIL)
                        .status(NotificationStatus.SENT)
                        .attemptedAt(Instant.now())
                        .errorMessage(null)
                        .build()
        );

        Mockito.when(notificationLogRepository.findAll()).thenReturn(logs);

        mockMvc.perform(get("/api/notifications/logs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }
}
