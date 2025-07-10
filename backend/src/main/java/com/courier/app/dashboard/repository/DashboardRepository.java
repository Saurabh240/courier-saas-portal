package com.courier.app.dashboard.repository;
import com.courier.app.dashboard.model.DashboardSummary;
import com.courier.app.orders.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface DashboardRepository extends JpaRepository<DashboardSummary, Long> {
    List<Order> getOrdersBetween(LocalDate start, LocalDate end);
}