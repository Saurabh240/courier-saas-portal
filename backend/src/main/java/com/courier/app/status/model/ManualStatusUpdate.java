package com.courier.app.status.model;
import com.courier.app.orders.model.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "manual_status_updates")
@Data
public class ManualStatusUpdate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private String comment;
    private String updatedBy;
    private LocalDateTime timestamp;
    @PrePersist
    public void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}
