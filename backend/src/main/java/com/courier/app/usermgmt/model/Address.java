package com.courier.app.usermgmt.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Address {
    @Id
    @GeneratedValue
    private Long id;

    private String line1;
    private String line2;
    private String city;
    private String state;
    private String zip;
    private String country;

    private boolean isDefault;

    @ManyToOne
    private User user;
}
