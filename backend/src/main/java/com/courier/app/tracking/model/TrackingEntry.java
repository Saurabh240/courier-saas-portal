package com.courier.app.tracking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name="tracking_entries")
@AllArgsConstructor
@NoArgsConstructor
public class TrackingEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private Long orderId;
    private String status;
    private String location;
    private LocalDateTime timestamp;
    @PrePersist
    private void onCreate(){
        this.timestamp=LocalDateTime.now();
    }
}
