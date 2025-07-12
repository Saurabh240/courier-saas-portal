package com.courier.app.status.model;
import com.courier.app.orders.model.OrderStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "status_update_audit")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StatusUpdateAudit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    @Enumerated(EnumType.STRING)
    private OrderStatus oldStatus;
    @Enumerated(EnumType.STRING)
    private OrderStatus newStatus;
    private String performedBy;
    private String reason;
    private LocalDateTime timestamp;
    @PrePersist
    public void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
