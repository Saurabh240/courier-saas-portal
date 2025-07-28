package com.courier.app.tracking.repository;


import com.courier.app.tracking.entity.Tracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackingRepository extends JpaRepository<Tracking, String> {
}
