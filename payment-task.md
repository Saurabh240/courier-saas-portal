# Payments – Razorpay & Stripe (Frontend vs Backend Tasks)

## A) 🛒 Payment Initiation (Frontend)

### Frontend Tasks

* **P-F1. "Pay Now" Button** (Order detail page – Customer role)

  * Visible when `order.paymentMode === PREPAID && order.paymentStatus in [PENDING, FAILED]`.
* **P-F2. Initiate Intent (Server-first)**

  * Call `POST /api/payments/:provider/orders` with `{ orderId }` (amount is server-calculated).
  * Render checkout ONLY after server responds with provider-specific fields.
* **P-F3. Razorpay Checkout**

  * Use returned `{ razorpayKey, orderId, amount, currency, customer }` to open checkout.
  * On client-side success, send confirmation to server (`/capture` optional; rely on webhook for truth).
* **P-F4. Stripe Checkout**

  * Receive `sessionId` and redirect via `stripe.redirectToCheckout({ sessionId })`.
* **P-F5. UI States**

  * Loading, failure, retry. Disable button to prevent double-click.
* **P-F6. Security**

  * Provider keys read from env. Do not embed secrets. Validate origin for Razorpay `handler` callback.

#### Acceptance Criteria (Frontend)

* Clicking Pay Now opens provider checkout with correct amount and order metadata.
* Payment success/failure shows clear state and auto-refreshes order status (poll `/orders/:id` or subscribe to event stream).

---

## B) 📤 Backend Payment Intent / Order API

### Backend Tasks

* **P-B1. Pricing & Validation**

  * Recompute payable amount on server from DB (line items, shipping, discounts, tax). Reject negative/zero amounts.
* **P-B2. Provider Settings**

  * Table `company_payment_settings(company_id, provider, enabled, api_key, api_secret, webhook_secret)`.
  * Feature flag per provider.
* **P-B3. Create Payment Order/Intent**

  * Endpoints:

    * `POST /api/payments/razorpay/orders` → Razorpay order; insert into `payments` with `status=PENDING`.
    * `POST /api/payments/stripe/sessions` → Stripe Checkout Session; insert payment row with `status=PENDING`.
* **P-B4. Persist & Link**

  * `payments.order_id` FK to `orders.id`. Store `gateway_order_id`, provisional `amount`, `currency`.
* **P-B5. Idempotency**

  * Idempotency key per `(orderId, provider)` within 10 minutes to prevent duplicates.
* **P-B6. Webhook Receivers**

  * `POST /api/payments/razorpay/webhook`
  * `POST /api/payments/stripe/webhook`
  * Verify HMAC/signature; update `payments.status` and `orders.paymentStatus` accordingly.
* **P-B7. Post-Payment Hooks**

  * Publish domain event `PaymentCaptured` → notify customer, trigger invoice email, unlock order processing.

### API Contracts

#### Create Razorpay Order

`POST /api/payments/razorpay/orders`

```json
{ "orderId": "ORD12345" }
```

**201 Created**

```json
{
  "orderId": "ORD12345",
  "razorpayKey": "rzp_test_xxx",
  "gatewayOrderId": "order_DBJOWzybf0sJbb",
  "amount": 129900,
  "currency": "INR",
  "customer": {"name":"Alice","email":"alice@example.com","contact":"9999999999"}
}
```

#### Create Stripe Checkout Session

`POST /api/payments/stripe/sessions`

```json
{ "orderId": "ORD12345" }
```

**201 Created**

```json
{
  "orderId": "ORD12345",
  "sessionId": "cs_test_a1b2c3",
  "publicKey": "pk_test_..."
}
```

#### Sample Webhook Payloads

**Razorpay**

```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "id": "pay_29QQoUBi66xm2f",
      "status": "captured",
      "order_id": "order_DBJOWzybf0sJbb"
    }
  }
}
```

**Stripe** (example)

```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3",
      "payment_status": "paid" ,
      "metadata": {"orderId": "ORD12345"}
    }
  }
}
```

---

## C) ✅ Payment Confirmation & Status Updates

### Backend Logic (source of truth = webhooks)

* **Razorpay**

  * Verify signature header `X-Razorpay-Signature` using `webhook_secret` and raw body.
  * On `payment.captured`:

    * `payments.status = SUCCESS`, `payments.gateway_payment_id = payload.payment.id`.
    * `orders.paymentStatus = PAID` (only if `payment_mode=PREPAID`).
* **Stripe**

  * Verify signature via `Stripe-Signature` header and secret.
  * On `checkout.session.completed && payment_status=paid`:

    * Mark `payments.status = SUCCESS`, capture `sessionId` as `gateway_order_id`.
    * `orders.paymentStatus = PAID`.
* Failures (`payment.failed`, `charge.failed`) → `payments.status=FAILED`, `orders.paymentStatus=FAILED`.

### Frontend Post-Payment UX

* Show success screen with receipt link (if available) and a button to view order.
* On failure: retry option; show support contact.

---

## Data Mapping (to existing schema)

**orders**

* `payment_mode` → `PREPAID` or `COD`
* `payment_status` → `PENDING|PAID|FAILED|COD_PENDING|COD_COLLECTED`

**payments**

* `payment_gateway` → `RAZORPAY|STRIPE`
* `gateway_order_id`, `gateway_payment_id`, `amount`, `currency`, `status`, `receipt_url`

---

## Security & Compliance

* Never trust `amount` from client; compute on server.
* Store minimal PII; mask card info (providers already tokenize).
* Webhooks: ensure **raw body** is available for signature verification (Spring Boot: disable body conversion for those endpoints).
* Use **idempotency keys** for provider create calls.
* Rotate secrets; restrict who can read `company_payment_settings`.

---

## Validation & Errors

* 400 if order not found / invalid state / amount mismatch.
* 409 if duplicate pending payment for same order within time window.
* 422 if provider disabled for tenant.
* 401/403 for unauthorized access.

Standard error schema:

```json
{ "timestamp":"...","status":422,"error":"Unprocessable Entity","message":"Razorpay disabled for this tenant","path":"/api/payments/razorpay/orders" }
```

---

## QA Scenarios

1. Prepaid order: create Razorpay order → checkout → webhook marks PAID; order locked from further payments.
2. Stripe session expired: status remains PENDING; retry works with new session.
3. Webhook replay: signature valid but already processed → idempotent no-op.
4. Wrong tenant hitting payments: 403.
5. Amount tampering on client: server recompute catches mismatch → 400.

---

## Definition of Done

* Frontend: Pay Now flows for Razorpay and Stripe with clean UX and retry.
* Backend: Create-intent endpoints, webhook verification, DB persistence, idempotency.
* Tests: Unit + integration (mock providers), webhook signature tests, end-to-end happy path with Testcontainers.

---

## Environment & Config

* **Razorpay**: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
* **Stripe**: `STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
* **General**: `PAYMENTS_PROVIDER=RAZORPAY|STRIPE|BOTH` (feature flag), `APP_BASE_URL` for success/cancel URLs.

---

## Example Frontend Hooks (pseudo-code)

```ts
// Razorpay
const { data } = await api.post('/api/payments/razorpay/orders', { orderId });
const rzp = new window.Razorpay({
  key: data.razorpayKey,
  order_id: data.gatewayOrderId,
  amount: data.amount,
  currency: data.currency,
  name: 'Your Brand',
  prefill: data.customer,
  handler: () => window.location.reload() // webhook is source of truth
});
rzp.open();

// Stripe
const { data } = await api.post('/api/payments/stripe/sessions', { orderId });
const stripe = await loadStripe(data.publicKey);
await stripe.redirectToCheckout({ sessionId: data.sessionId });
```
