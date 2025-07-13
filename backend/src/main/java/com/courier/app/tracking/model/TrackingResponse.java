package com.courier.app.tracking.model;

import java.time.LocalDateTime;

public record TrackingResponse(Long id,
                               Long orderId,
                               String status,
                               String location,
                               LocalDateTime timestamp) {
}
