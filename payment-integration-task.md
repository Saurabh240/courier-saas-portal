Payments + COD

## 📦 `src/main/java/com/example/courier/domain/enums/PaymentMode.java`

```java
package com.example.courier.domain.enums;

public enum PaymentMode {
    PREPAID,
    COD
}
```

---

## 📦 `src/main/java/com/example/courier/domain/enums/PaymentStatus.java`

```java
package com.example.courier.domain.enums;

public enum PaymentStatus {
    PENDING,
    PAID,          // for prepaid success
    FAILED,        // for prepaid failure
    COD_PENDING,   // out for delivery; cash not collected yet
    COD_COLLECTED  // cash collected
}
```

---

## 🧱 `src/main/java/com/example/courier/domain/base/Auditable.java`

```java
package com.example.courier.domain.base;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@MappedSuperclass
public abstract class Auditable {

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
```

---

## 📦 `src/main/java/com/example/courier/domain/order/Order.java`

```java
package com.example.courier.domain.order;

import com.example.courier.domain.base.Auditable;
import com.example.courier.domain.enums.PaymentMode;
import com.example.courier.domain.enums.PaymentStatus;
import com.example.courier.domain.payment.Payment;
import com.example.courier.domain.payment.CodCollection;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "orders")
public class Order extends Auditable {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    // ... existing fields (customer, addresses, etc.)

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_mode", length = 20, nullable = false)
    private PaymentMode paymentMode = PaymentMode.PREPAID;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20, nullable = false)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    @Column(name = "cod_amount", precision = 10, scale = 2)
    private BigDecimal codAmount; // only for COD

    @Column(name = "is_cod_collected", nullable = false)
    private boolean codCollected = false;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CodCollection> codCollections = new ArrayList<>();

    // getters/setters
    public UUID getId() { return id; }
    public PaymentMode getPaymentMode() { return paymentMode; }
    public void setPaymentMode(PaymentMode paymentMode) { this.paymentMode = paymentMode; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    public BigDecimal getCodAmount() { return codAmount; }
    public void setCodAmount(BigDecimal codAmount) { this.codAmount = codAmount; }
    public boolean isCodCollected() { return codCollected; }
    public void setCodCollected(boolean codCollected) { this.codCollected = codCollected; }
    public List<Payment> getPayments() { return payments; }
    public List<CodCollection> getCodCollections() { return codCollections; }
}
```

---

## 💳 `src/main/java/com/example/courier/domain/payment/Payment.java`

```java
package com.example.courier.domain.payment;

import com.example.courier.domain.base.Auditable;
import com.example.courier.domain.order.Order;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment extends Auditable {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, columnDefinition = "uuid")
    private Order order;

    @Column(name = "payment_gateway", length = 20)
    private String paymentGateway; // RAZORPAY / STRIPE

    @Column(name = "gateway_payment_id", length = 100)
    private String gatewayPaymentId; // e.g., pay_29QQ...

    @Column(name = "gateway_order_id", length = 100)
    private String gatewayOrderId; // e.g., order_DBJO...

    @Column(name = "amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(name = "currency", length = 10)
    private String currency = "INR";

    @Column(name = "status", length = 20, nullable = false)
    private String status = "PENDING"; // PENDING/SUCCESS/FAILED (gateway level)

    @Column(name = "receipt_url")
    private String receiptUrl;

    // getters/setters
    public UUID getId() { return id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public String getPaymentGateway() { return paymentGateway; }
    public void setPaymentGateway(String paymentGateway) { this.paymentGateway = paymentGateway; }
    public String getGatewayPaymentId() { return gatewayPaymentId; }
    public void setGatewayPaymentId(String gatewayPaymentId) { this.gatewayPaymentId = gatewayPaymentId; }
    public String getGatewayOrderId() { return gatewayOrderId; }
    public void setGatewayOrderId(String gatewayOrderId) { this.gatewayOrderId = gatewayOrderId; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
}
```

---

## 💵 `src/main/java/com/example/courier/domain/payment/CodCollection.java`

```java
package com.example.courier.domain.payment;

import com.example.courier.domain.base.Auditable;
import com.example.courier.domain.order.Order;
import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "cod_collections")
public class CodCollection extends Auditable {

    @Id
    @UuidGenerator
    @Column(columnDefinition = "uuid")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false, columnDefinition = "uuid")
    private Order order;

    @Column(name = "collector_id", columnDefinition = "uuid", nullable = false)
    private UUID collectorId; // courier user id

    @Column(name = "amount_collected", precision = 10, scale = 2, nullable = false)
    private BigDecimal amountCollected;

    @Column(name = "collected_at")
    private OffsetDateTime collectedAt;

    // getters/setters
    public UUID getId() { return id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
    public UUID getCollectorId() { return collectorId; }
    public void setCollectorId(UUID collectorId) { this.collectorId = collectorId; }
    public BigDecimal getAmountCollected() { return amountCollected; }
    public void setAmountCollected(BigDecimal amountCollected) { this.amountCollected = amountCollected; }
    public OffsetDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(OffsetDateTime collectedAt) { this.collectedAt = collectedAt; }
}
```

---

# 🛠 Flyway Migration (PostgreSQL)

## 📄 `src/main/resources/db/migration/V007__payments_cod.sql`

```sql
-- Enable pgcrypto for gen_random_uuid (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ORDERS: add payment columns (id column assumed to exist)
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(20) DEFAULT 'PREPAID' NOT NULL,
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    ADD COLUMN IF NOT EXISTS cod_amount NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS is_cod_collected BOOLEAN DEFAULT FALSE NOT NULL;

-- PAYMENTS table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway VARCHAR(20),
    gateway_payment_id VARCHAR(100),
    gateway_order_id VARCHAR(100),
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- COD COLLECTIONS table
CREATE TABLE IF NOT EXISTS cod_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    collector_id UUID NOT NULL,
    amount_collected NUMERIC(10,2) NOT NULL,
    collected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_payments_order ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_cod_order ON cod_collections(order_id);
```

> If you already have Flyway versions in use, bump `V007` accordingly.

---

## 🔗 Usage Notes

* Keep **gateway `status`** (in `payments`) separate from **business `paymentStatus`** (in `orders`).
* When COD is collected, set `orders.paymentStatus = COD_COLLECTED`, `orders.is_cod_collected = true`, and insert a `cod_collections` record.
* For prepaid, on webhook success: insert `payments` row, set `orders.paymentStatus = PAID`.

---

## ✅ Optional: Spring Repos (quick start)

### `PaymentRepository.java`

```java
package com.example.courier.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByOrder_Id(UUID orderId);
}
```

### `CodCollectionRepository.java`

```java
package com.example.courier.domain.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CodCollectionRepository extends JpaRepository<CodCollection, UUID> {
    List<CodCollection> findByOrder_Id(UUID orderId);
}
```
