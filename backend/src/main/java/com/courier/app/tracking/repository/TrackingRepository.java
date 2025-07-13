package com.courier.app.tracking.repository;

import com.courier.app.tracking.model.TrackingEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackingRepository extends JpaRepository<TrackingEntry,Long>,CustomTrackingRepository {
}
