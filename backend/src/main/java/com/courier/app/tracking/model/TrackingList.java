package com.courier.app.tracking.model;

import java.time.LocalDateTime;

public record TrackingList(LocalDateTime timeStamp,String status) {
}
