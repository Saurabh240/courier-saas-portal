package com.courier.app.status.repository;
import com.courier.app.status.model.StatusUpdateAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StatusUpdateAuditRepository extends JpaRepository<StatusUpdateAudit, Long> {
    List<StatusUpdateAudit> findByOrderIdOrderByTimestampDesc(Long orderId);
}
