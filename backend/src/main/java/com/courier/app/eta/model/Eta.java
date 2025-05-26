package com.courier.app.eta.model;

import jakarta.persistence.*;

@Entity
public class Eta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // TODO: Define fields
}
