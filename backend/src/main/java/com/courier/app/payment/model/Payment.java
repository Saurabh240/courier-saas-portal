package com.courier.app.payment.model;

import com.courier.app.orders.model.Order;
import com.courier.app.payment.model.PaymentProvider;
import com.courier.app.payment.model.PaymentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "payments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider_order_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    private PaymentProvider provider;

    @Column(name = "provider_order_id")
    private String providerOrderId;

    @Column(name = "provider_payment_id")
    private String providerPaymentId;

    @Column(name = "amount_paise")
    private Long amountPaise;

    private String currency;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Lob
    @Column(name = "raw_payload")
    private String rawPayload;

    @Column(name = "last_event")
    private String lastEvent;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();
}