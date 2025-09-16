package com.courier.app.payment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;


@Entity
@Table(name = "payments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"providerOrderId"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    private PaymentProvider provider ;
    private String providerOrderId;       // e.g., order_DBJOWzybf0sJbb
    private String providerPaymentId;     // e.g., pay_29QQoUBi66xm2f
    private Long amountPaise;
    private String currency;              // INR
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    @Lob private String rawPayload;       // last webhook payload (optional)
    private String lastEvent;             // e.g., payment.captured
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
}

