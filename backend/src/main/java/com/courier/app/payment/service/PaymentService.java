package com.courier.app.payment.service;


import com.courier.app.payment.model.CreatePaymentOrderRequest;
import com.courier.app.payment.model.CreatePaymentOrderResponse;
import com.courier.app.payment.model.PaymentProvider;
import com.courier.app.payment.model.VerifyPaymentRequest;

public interface PaymentService {
    CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, PaymentProvider provider) throws Exception;

    void handleWebhook(String payload, PaymentProvider provider) throws Exception;

    CreatePaymentOrderResponse verifyPayment(VerifyPaymentRequest request, PaymentProvider provider) throws Exception;
}
