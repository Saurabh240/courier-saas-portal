package com.courier.app.payment.repository;

import com.courier.app.orders.model.Order;
import com.courier.app.payment.model.Payment;
import com.courier.app.payment.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByProviderPaymentId(String providerPaymentId);
    Optional<Payment> findByOrder(Order order);

    @Query("SELECT COALESCE(SUM(p.amountPaise), 0) FROM Payment p " +
            "WHERE p.status = :status AND p.createdAt >= :start AND p.createdAt < :end")
    Long sumAmountPaiseByStatusAndCreatedAtBetween(
            @Param("status") PaymentStatus status,
            @Param("start") Instant start,
            @Param("end") Instant end);



}
