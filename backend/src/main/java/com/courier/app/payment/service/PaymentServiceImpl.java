package com.courier.app.payment.service;

import com.courier.app.orders.repository.OrderRepository;
import com.courier.app.payment.config.PaymentConfig;
import com.courier.app.payment.config.PaymentProperties;
import com.courier.app.payment.model.*;
import com.courier.app.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentConfig config;
    private final PaymentProperties properties;
    private final PaymentRepository repository;
    private final OrderRepository orderRepository;
    @Transactional
    @Override
    public CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, PaymentProvider provider) throws Exception {
        // ✅ Fetch courier order (to link payment with it)
        var courierOrder = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Courier order not found with id: " + request.orderId()));
        repository.findByOrder(courierOrder).ifPresent(existing -> {
            throw new IllegalStateException("Payment already exists for this order");
        });

        switch (provider) {
            case RAZORPAY -> {
                RazorpayClient razorpayClient = config.razorpayClient();

                JSONObject orderRequest = new JSONObject();
                orderRequest.put("amount", request.amount() * 100); // amount in paise
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", request.orderId().toString());

                Order order = razorpayClient.orders.create(orderRequest);

                // Save to DB
                var payment = new Payment();
                payment.setOrder(courierOrder);
                payment.setProvider(PaymentProvider.RAZORPAY);
                payment.setProviderOrderId(order.get("id"));
                payment.setAmountPaise((long) request.amount() * 100);
                payment.setCurrency(order.get("currency"));
                payment.setStatus(PaymentStatus.CREATED);
                repository.save(payment);

                return new CreatePaymentOrderResponse(
                        order.get("id"),
                        properties.getRazorpay().getKeyId(),
                        request.amount(),
                        order.get("currency"),
                        order.get("status")
                );
            }

            case STRIPE -> {
                String successUrl = System.getenv().getOrDefault("STRIPE_SUCCESS_URL", "http://localhost:8080/success");
                String cancelUrl = System.getenv().getOrDefault("STRIPE_CANCEL_URL", "http://localhost:8080/cancel");

                SessionCreateParams params = SessionCreateParams.builder()
                        .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("inr")
                                                        .setUnitAmount((long) request.amount() * 100)
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Order " + request.orderId())
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl(successUrl)
                        .setCancelUrl(cancelUrl)
                        .build();

                Session session = Session.create(params);


                var payment = new Payment();
                payment.setOrder(courierOrder);
                payment.setProvider(PaymentProvider.STRIPE);
                payment.setProviderOrderId(session.getId());
                payment.setAmountPaise((long) request.amount() * 100);
                payment.setCurrency(session.getCurrency());
                payment.setStatus(PaymentStatus.CREATED);
                repository.save(payment);

                return new CreatePaymentOrderResponse(
                        session.getId(),
                        properties.getStripe().getPublishableKey(),
                        request.amount(),
                        session.getCurrency(),
                        session.getStatus()
                );
            }

            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
    }


    @Override
    public void handleWebhook(String payload, PaymentProvider provider) throws Exception {
        switch (provider) {
            case RAZORPAY -> {
                // Directly parse the Razorpay webhook event (skip signature verification)
                JSONObject event = new JSONObject(payload);
                String eventType = event.getString("event"); // e.g., "payment.captured"

                JSONObject paymentEntity = event
                        .getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");

                String providerOrderId = paymentEntity.getString("order_id");
                String providerPaymentId = paymentEntity.getString("id");
                String status = paymentEntity.getString("status"); // "captured", "failed", etc.

                // Update DB record for this payment
                repository.findByProviderOrderId(providerOrderId).ifPresent(payment -> {
                    payment.setProviderPaymentId(providerPaymentId);
                    payment.setStatus(PaymentStatus.valueOf(status.toUpperCase()));
                    payment.setLastEvent(eventType);         // ✅ store event name
                    payment.setRawPayload(payload);// map string → enum
                    repository.save(payment);
                });
            }

            case STRIPE -> {
                // Directly parse Stripe webhook payload (skip signature verification)
                com.stripe.model.Event event = com.stripe.model.Event.GSON.fromJson(payload, com.stripe.model.Event.class);
                String eventType = event.getType();
                switch (event.getType()) {
                    case "checkout.session.completed" -> {
                        com.stripe.model.checkout.Session session =
                                (com.stripe.model.checkout.Session) event.getDataObjectDeserializer()
                                        .getObject()
                                        .orElseThrow();

                        String providerOrderId = session.getId();
                        String status = session.getPaymentStatus(); // "paid" or "unpaid"

                        repository.findByProviderOrderId(providerOrderId).ifPresent(payment -> {
                            payment.setStatus(PaymentStatus.valueOf(status.toUpperCase()));
                            payment.setLastEvent(eventType);        // ✅ store event name
                            payment.setRawPayload(payload);
                            repository.save(payment);
                        });
                    }

                    case "payment_intent.payment_failed" -> {
                        com.stripe.model.PaymentIntent intent =
                                (com.stripe.model.PaymentIntent) event.getDataObjectDeserializer()
                                        .getObject()
                                        .orElseThrow();

                        String providerOrderId = intent.getId();

                        repository.findByProviderOrderId(providerOrderId).ifPresent(payment -> {
                            payment.setStatus(PaymentStatus.FAILED);
                            payment.setLastEvent(eventType);        // ✅ store event name
                            payment.setRawPayload(payload);
                            repository.save(payment);
                        });
                    }
                }
            }

            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
    }


    @Override
    public CreatePaymentOrderResponse verifyPayment(VerifyPaymentRequest request, PaymentProvider provider) throws Exception {
        PaymentStatus status;
        double amount;
        String keyId;
        String currency;

        switch (provider) {
            case RAZORPAY -> {
                JSONObject attributes = new JSONObject();
                attributes.put("razorpay_order_id", request.orderId());
                attributes.put("razorpay_payment_id", request.paymentId());
                //attributes.put("razorpay_signature", request.signature());


                //com.razorpay.Utils.verifyPaymentSignature(attributes, properties.getRazorpay().getKeySecret());

                var payment = repository.findByProviderOrderId(request.orderId())
                        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

                status = payment.getStatus();
                amount = payment.getAmountPaise() / 100.0;
                keyId = properties.getRazorpay().getKeyId();
                currency = payment.getCurrency();
            }

            case STRIPE -> {
                var payment = repository.findByProviderOrderId(request.orderId())
                        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

                status = payment.getStatus();
                amount = payment.getAmountPaise() / 100.0;
                keyId = properties.getStripe().getPublishableKey();
                currency = payment.getCurrency();
            }

            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        return new CreatePaymentOrderResponse(
                request.orderId(),
                keyId,
                amount,
                currency,
                status.name()
        );
    }
}
