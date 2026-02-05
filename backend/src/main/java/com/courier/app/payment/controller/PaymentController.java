package com.courier.app.payment.controller;

import com.courier.app.payment.model.*;
import com.courier.app.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PreAuthorize("hasAnyRole('CUSTOMER')")
    @PostMapping("/{provider}/order")
    public ResponseEntity<CreatePaymentOrderResponse> createOrder(
            @PathVariable PaymentProvider provider,
            @RequestBody CreatePaymentOrderRequest req) throws Exception {

        return ResponseEntity.ok(service.createOrder(req, provider));
    }

    @PostMapping("/{provider}/webhook")
    public ResponseEntity<String> webhook(
            @PathVariable PaymentProvider provider,
            @RequestBody String rawBody) throws Exception {

        // Let provider handle signature verification internally or skip for test mode
        service.handleWebhook(rawBody, provider);
        return ResponseEntity.ok("ok");
    }

    @PostMapping("/{provider}/verify")
    public ResponseEntity<CreatePaymentOrderResponse> verify(
            @PathVariable PaymentProvider provider,
            @RequestBody VerifyPaymentRequest req) throws Exception {

        CreatePaymentOrderResponse response = service.verifyPayment(req, provider);

        return ResponseEntity.ok(response);
    }

}
