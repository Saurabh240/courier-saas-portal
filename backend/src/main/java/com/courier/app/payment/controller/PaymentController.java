package com.courier.app.payment.controller;

import com.courier.app.payment.model.*;
import com.courier.app.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService service;

    @PostMapping("/{provider}/order")
    public ResponseEntity<CreatePaymentOrderResponse> createOrder(
            @PathVariable PaymentProvider provider,
            @RequestBody CreatePaymentOrderRequest req) throws Exception {

        return ResponseEntity.ok(service.createOrder(req, provider));
    }

    @PostMapping("/{provider}/webhook")
    public ResponseEntity<String> webhook(
            @PathVariable PaymentProvider provider,
            @RequestBody String rawBody,
            @RequestHeader(name = "X-Razorpay-Signature", required = false) String razorpaySignature,
            @RequestHeader(name = "Stripe-Signature", required = false) String stripeSignature) throws Exception {

        // pick signature depending on provider
        String signature = switch (provider) {
            case RAZORPAY -> razorpaySignature;
            case STRIPE -> stripeSignature;
            default -> null;
        };

        service.handleWebhook(rawBody, signature, provider);
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
