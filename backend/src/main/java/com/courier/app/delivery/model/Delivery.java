package com.courier.app.delivery.model;

import jakarta.persistence.*;

@Entity
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Define fields
}
