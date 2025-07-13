package com.courier.app.tracking.model;

public record TrackingRequest(Long orderId,
                              String status,
                              String location) {
}
