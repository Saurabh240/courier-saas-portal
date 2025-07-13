package com.courier.app.tracking.repository;

import com.courier.app.tracking.model.TrackingEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackingRepository extends JpaRepository<TrackingEntry,Long>{
    List<TrackingEntry> findByOrderIdOrderByTimestampDesc(Long orderId);
}
