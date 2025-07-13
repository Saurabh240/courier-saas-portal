package com.courier.app.tracking.repository;

import com.courier.app.tracking.model.TrackingEntry;

import java.util.List;

public interface CustomTrackingRepository {
    List<TrackingEntry> findByOrderIdOrderByTimestampDesc(Long orderId);
}
