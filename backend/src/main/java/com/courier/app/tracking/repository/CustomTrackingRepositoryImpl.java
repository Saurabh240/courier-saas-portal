package com.courier.app.tracking.repository;

import com.courier.app.tracking.model.TrackingEntry;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.util.List;

public class CustomTrackingRepositoryImpl implements CustomTrackingRepository{

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<TrackingEntry> findByOrderIdOrderByTimestampDesc(Long orderId) {

        String jpql = "SELECT te FROM TrackingEntry te WHERE te.orderId = :orderId ORDER BY te.timestamp DESC";

        return entityManager
                .createQuery(jpql, TrackingEntry.class)
                .setParameter("orderId",orderId)
                .getResultList();
    }
}
