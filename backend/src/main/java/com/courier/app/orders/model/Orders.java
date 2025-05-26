package com.courier.app.orders.model;

import jakarta.persistence.*;

@Entity
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Define fields
}
