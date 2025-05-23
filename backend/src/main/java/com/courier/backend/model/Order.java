package com.courier.backend.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String senderName;
    private String receiverName;
    private String fromAddress;
    private String toAddress;
    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
}
