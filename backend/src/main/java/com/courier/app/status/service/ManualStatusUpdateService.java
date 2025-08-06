package com.courier.app.status.service;
import com.courier.app.status.model.ManualStatusUpdate;
import com.courier.app.status.model.ManualStatusUpdateRequest;
import com.courier.app.status.model.ManualStatusUpdateResponse;
import com.courier.app.status.model.StatusUpdateAudit;
import com.courier.app.status.model.StatusUpdateAuditResponse;
import com.courier.app.status.repository.ManualStatusUpdateRepository;
import com.courier.app.status.repository.StatusUpdateAuditRepository;
import com.courier.app.orders.model.Order;
import com.courier.app.orders.model.OrderStatus;
import com.courier.app.orders.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
 public class ManualStatusUpdateService {
    @Autowired
    private ManualStatusUpdateRepository repository;
    @Autowired
    private StatusUpdateAuditRepository auditRepository;
    @Autowired
    private OrderRepository orderRepository;
    private boolean isValidTransition(OrderStatus oldStatus, OrderStatus newStatus) {
        return switch (oldStatus) {
            case PENDING -> newStatus == OrderStatus.CREATED || newStatus == OrderStatus.CANCELLED;
            case CREATED -> newStatus == OrderStatus.PICKED_UP || newStatus == OrderStatus.CANCELLED;
            case PICKED_UP -> newStatus == OrderStatus.IN_TRANSIT || newStatus == OrderStatus.CANCELLED;
            case IN_TRANSIT -> newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.CANCELLED;
            case DELIVERED, CANCELLED -> false;
        };
    }
    public ManualStatusUpdateResponse recordUpdate(ManualStatusUpdateRequest req, String updatedBy) {
        Order order = orderRepository.findById(req.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = req.status();

        if (!isValidTransition(oldStatus, newStatus)) {
            throw new IllegalStateException("Invalid status transition from " + oldStatus + " to " + newStatus);
        }
        order.setStatus(newStatus);
        orderRepository.save(order);

        ManualStatusUpdate entry = new ManualStatusUpdate();
        entry.setOrderId(req.orderId());
        entry.setStatus(newStatus);
        entry.setComment(req.comment());
        entry.setUpdatedBy(updatedBy);

        auditRepository.save(new StatusUpdateAudit(
                null,
                req.orderId(),
                oldStatus,
                newStatus,
                updatedBy,
                req.comment(),
                null
        ));

        return toResponse(repository.save(entry));
    }


    public List<ManualStatusUpdateResponse> getHistory(Long orderId) {
        return repository.findByOrderIdOrderByTimestampDesc(orderId).stream().map(this::toResponse).toList();
    }

    public List<StatusUpdateAuditResponse> getAuditLog(Long orderId) {
        return auditRepository.findByOrderIdOrderByTimestampDesc(orderId).stream().map(this::toAuditResponse).toList();
    }

    private ManualStatusUpdateResponse toResponse(ManualStatusUpdate entry) {
        return new ManualStatusUpdateResponse(
                entry.getId(), entry.getOrderId(), entry.getStatus(), entry.getComment(), entry.getUpdatedBy(), entry.getTimestamp()
        );
    }

    private StatusUpdateAuditResponse toAuditResponse(StatusUpdateAudit audit) {
        return new StatusUpdateAuditResponse(
                audit.getId(), audit.getOrderId(), audit.getOldStatus(), audit.getNewStatus(), audit.getPerformedBy(), audit.getReason(), audit.getTimestamp()
        );
    }
}