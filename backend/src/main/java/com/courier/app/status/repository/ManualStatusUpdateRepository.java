package com.courier.app.status.repository;
import com.courier.app.status.model.ManualStatusUpdate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ManualStatusUpdateRepository extends JpaRepository<ManualStatusUpdate, Long> {
    List<ManualStatusUpdate> findByOrderIdOrderByTimestampDesc(Long orderId);
}

