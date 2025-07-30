package com.courier.app.tracking.repository;



import com.courier.app.tracking.entity.TrackingLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingLocationRepository extends JpaRepository<TrackingLocation, Long> {
    List<TrackingLocation> findByTrackingIdOrderByTimestampAsc(String trackingId);
}
