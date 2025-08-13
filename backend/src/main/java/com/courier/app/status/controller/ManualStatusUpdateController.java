package com.courier.app.status.controller;
import com.courier.app.status.model.ManualStatusUpdateRequest;
import com.courier.app.status.model.ManualStatusUpdateResponse;
import com.courier.app.status.model.StatusUpdateAuditResponse;
import com.courier.app.status.service.ManualStatusUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/status")
public class ManualStatusUpdateController {

    @Autowired
    private ManualStatusUpdateService service;
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DELIVERY_PARTNER')")
    public ManualStatusUpdateResponse update(
            @RequestBody ManualStatusUpdateRequest request,
            Authentication authentication
    ) {
        return service.recordUpdate(request, authentication.getName());
    }
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF', 'DELIVERY_PARTNER', 'CUSTOMER')")
    public List<ManualStatusUpdateResponse> history(@PathVariable Long orderId) {
        return service.getHistory(orderId);
    }

    @GetMapping("/{orderId}/audit")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public List<StatusUpdateAuditResponse> auditLog(@PathVariable Long orderId) {
        return service.getAuditLog(orderId);
    }
}
