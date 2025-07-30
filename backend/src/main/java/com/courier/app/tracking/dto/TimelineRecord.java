package com.courier.app.tracking.dto;

public record TimelineRecord(Location location,
                             String timeStamp,
                             String status) {
}
