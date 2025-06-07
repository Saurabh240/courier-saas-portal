package com.courier.app.usermgmt.model;

public enum Role {
    ADMIN, STAFF, PARTNER, CUSTOMER;

    public static Role fromString(String value) {
        return Role.valueOf(value.trim().toUpperCase());
    }
}
