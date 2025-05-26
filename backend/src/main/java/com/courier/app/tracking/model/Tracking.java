package com.courier.app.tracking.model;

import jakarta.persistence.*;

@Entity
public class Tracking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Define fields
}
