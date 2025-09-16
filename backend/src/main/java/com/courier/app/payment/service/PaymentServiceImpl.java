package com.courier.app.payment.service;

import com.courier.app.orders.repository.OrderRepository;
import com.courier.app.payment.config.PaymentConfig;
import com.courier.app.payment.config.PaymentProperties;
import com.courier.app.payment.model.*;
import com.courier.app.payment.repository.PaymentRepository;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentConfig config;
    private final PaymentProperties properties;
    private final PaymentRepository repository;


    @Override
    public CreatePaymentOrderResponse createOrder(CreatePaymentOrderRequest request, PaymentProvider provider) throws Exception {
        switch (provider) {
            case RAZORPAY -> {
                // Example Razorpay logic
                var razorpayClient = config.razorpayClient();
                var order = razorpayClient.items.create((org.json.JSONObject) Map.of(
                        "amount", request.amount() * 100,  // in paise
                        "receipt", request.orderId().toString()
                ));
                return new CreatePaymentOrderResponse(
                        order.get("id"),
                        properties.getRazorpay().getKeyId(),
                        request.amount()

                );
            }

            case STRIPE -> {
                // Example Stripe logic
                Session session =
                        Session.create(Map.of(
                                "payment_method_types", List.of("card"),
                                "line_items", List.of(Map.of(
                                        "price_data", Map.of(
                                                "product_data", Map.of("name", "Order " + request.orderId()),
                                                "unit_amount", request.amount() * 100
                                        ),
                                        "quantity", 1
                                )),
                                "mode", "payment",
                                "success_url", "https://yourapp.com/success",
                                "cancel_url", "https://yourapp.com/cancel"
                        ));
                return new CreatePaymentOrderResponse(
                        session.getId(),
                        properties.getStripe().getPublishableKey(),
                        request.amount()

                );
            }

            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
    }

    @Override
    public void handleWebhook(String payload, String signature, PaymentProvider provider) throws Exception {
        switch (provider) {
            case RAZORPAY -> {
                // Verify Razorpay webhook
                var utils = new com.razorpay.Utils();
                boolean valid = utils.verifyWebhookSignature(payload, signature, properties.getRazorpay().getWebhookSecret());
                if (!valid) throw new SecurityException("Invalid Razorpay webhook signature");
                // process event...
            }
            case STRIPE -> {
                com.stripe.model.Event event =
                        com.stripe.net.Webhook.constructEvent(payload, signature, properties.getStripe().getWebhookSecret());
                // process event...
            }
            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }
    }

    @Override
    public CreatePaymentOrderResponse verifyPayment(VerifyPaymentRequest request, PaymentProvider provider) throws Exception {
        PaymentStatus status;
        int amount = 0; // default, in case Stripe doesn't provide it
        String keyId;

        switch (provider) {
            case RAZORPAY -> {
                // Verify Razorpay signature
                String expected = String.valueOf(com.razorpay.Utils.verifyPaymentSignature(
                        (org.json.JSONObject) Map.of(
                                "razorpay_order_id", request.orderId(),
                                "razorpay_payment_id", request.paymentId(),
                                "razorpay_signature", request.signature()
                        ),
                        properties.getRazorpay().getKeySecret()
                ));

                boolean valid = expected.equals(request.signature());

                // Fetch the payment from DB if you want actual status and amount
                var payment = repository.findByProviderOrderId(request.orderId())
                        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

                status = valid ? payment.getStatus() : PaymentStatus.FAILED;
                amount = (int) (payment.getAmountPaise() / 100); // convert paise to amount
                keyId = properties.getRazorpay().getKeyId();
            }

            case STRIPE -> {
                // For Stripe, assume checkout session handles verification
                var payment = repository.findByProviderOrderId(request.orderId())
                        .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

                status = payment.getStatus(); // captured, failed, etc.
                amount = (int) (payment.getAmountPaise() / 100); // if stored in cents
                keyId = properties.getStripe().getPublishableKey();
            }

            default -> throw new IllegalArgumentException("Unsupported provider: " + provider);
        }

        return new CreatePaymentOrderResponse(
                request.orderId(),
                keyId,
                amount

        );
    }



}
