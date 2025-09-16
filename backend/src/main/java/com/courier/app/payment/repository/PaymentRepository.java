package com.courier.app.payment.repository;

import com.courier.app.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByProviderOrderId(String providerOrderId);
    Optional<Payment> findByProviderPaymentId(String providerPaymentId);
}
