package com.courier.app.dashboard.repository;

import com.courier.app.orders.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Aggregate queries that back the admin/staff dashboard ({@code GET /api/dashboard/summary}).
 *
 * <p>All queries run against the currently resolved tenant schema (via the
 * SCHEMA based multi-tenancy connection provider), so results are automatically
 * scoped to the current tenant without any extra filtering here.</p>
 */
@Repository
public interface DashboardRepository extends JpaRepository<Order, Long> {

    /** Total number of orders, regardless of status. */
    @Query("SELECT COUNT(o) FROM Order o")
    long countAllOrders();

    /**
     * Number of orders grouped by their current status.
     * Returns rows of {@code [OrderStatus status, Long count]}.
     */
    @Query("SELECT o.status AS status, COUNT(o) AS total FROM Order o GROUP BY o.status")
    List<Object[]> countOrdersGroupedByStatus();

    /**
     * Daily order counts for orders created on/after {@code since}, grouped by calendar day.
     * Returns rows of {@code [java.sql.Date day, Long count]}, ordered oldest-first.
     */
    @Query("SELECT CAST(o.createdAt AS date) AS day, COUNT(o) AS total " +
            "FROM Order o " +
            "WHERE o.createdAt >= :since " +
            "GROUP BY CAST(o.createdAt AS date) " +
            "ORDER BY day ASC")
    List<Object[]> countOrdersByDaySince(@Param("since") LocalDateTime since);
}