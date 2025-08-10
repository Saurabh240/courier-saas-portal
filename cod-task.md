# COD Module Integration – Frontend vs Backend Tasks

## A) 🧾 Enable COD Option (Frontend)

### Frontend Tasks

* **COD-F1. Order Create Form** – Add checkbox/toggle for COD selection.
* **COD-F2. Form Binding** – Show `codAmount` input only when COD selected; validate amount > 0.
* **COD-F3. Payload** – Include `paymentMode = COD` and `codAmount` in order create request.
* **COD-F4. UI Defaults** – Default unchecked; amount hidden until selected.

#### Example Create Order Request

```json
{
  "customerEmail": "customer@example.com",
  "senderName": "Alice",
  "receiverName": "Bob",
  "pickupAddress": "123 A St",
  "deliveryAddress": "456 B St",
  "paymentMode": "COD",
  "codAmount": 500
}
```

---

## B) 🗃️ Backend COD Support

### Backend Tasks

* **COD-B1. Schema** – Add `payment_mode`, `cod_amount`, `payment_status`, `is_cod_collected` to `orders`.
* **COD-B2. Defaults** – Set `paymentStatus = COD_PENDING` for COD orders.
* **COD-B3. Validation** – Reject COD without `codAmount` > 0.
* **COD-B4. Role Guard** – Only STAFF/ADMIN can create COD orders.

---

## C) 📲 COD Collection Entry (Courier Panel)

### Frontend Tasks

* **COD-F5. UI** – Add form for couriers to input collected amount on delivered orders.
* **COD-F6. Validation** – Amount must match or exceed `codAmount`.
* **COD-F7. API Call** – `POST /api/orders/{orderId}/cod/collect` with `amountCollected` and `collectorId`.

### Backend Tasks

* **COD-B5. API** – Accept collection request, verify courier is assigned, order is in deliverable state.
* **COD-B6. Update** – Set `paymentStatus = COD_COLLECTED`, `is_cod_collected = true`, insert into `cod_collections`.

#### Example Collection Request

```json
{
  "amountCollected": 500,
  "collectorId": "courier_12"
}
```

---

## Data Model

* **orders** – `payment_mode`, `cod_amount`, `payment_status`, `is_cod_collected`.
* **cod\_collections** – `id`, `order_id`, `collector_id`, `amount_collected`, `collected_at`.

---

## Security

* Couriers can only collect for assigned orders.
* Block duplicate collections.
* Keep audit trail in `cod_collections`.

---

## QA Scenarios

1. Create COD order → correct mode, amount saved.
2. Courier collects → status changes to COD\_COLLECTED.
3. Unauthorized courier → 403.
4. Amount mismatch → error.

---

## Definition of Done

* COD selection in order creation works end-to-end.
* Backend updates payment status correctly.
* Collection entry by courier updates DB and order status.
* Tests for creation, collection, and role-based access control.

---

## ✅ Acceptance Criteria (per module)

**A) Enable COD (Frontend)**

* COD toggle defaults **off**; when on, `codAmount` becomes required (> 0) and currency shown.
* Submitting with COD includes `paymentMode = COD`, `codAmount` in payload.
* Order detail view clearly shows **Payment: COD (Pending)** until collected.

**B) Backend COD Support**

* Creating a COD order sets `payment_status = COD_PENDING`, persists `cod_amount`.
* Non-COD orders ignore `codAmount` and remain `payment_status = PENDING` or `PAID` depending on prepaid flow.

**C) Courier Collection**

* Only assigned courier can mark collection; status transitions to `COD_COLLECTED` once.
* Duplicate collection attempts return 409 with guidance.

---

## 🔌 API Contracts (detailed)

### 1) Create Order (COD)

`POST /api/orders`

```json
{
  "senderName": "Alice",
  "receiverName": "Bob",
  "pickupAddress": "123 A St",
  "deliveryAddress": "456 B St",
  "paymentMode": "COD",
  "codAmount": 500
}
```

**201 Created**

```json
{
  "orderId": "c7f2d2b0-3f7f-4df6-8d61-2d7f70e2e6d9",
  "paymentMode": "COD",
  "paymentStatus": "COD_PENDING",
  "codAmount": 500
}
```

**400** (validation)

```json
{ "error":"codAmount must be > 0 when paymentMode=COD" }
```

### 2) COD Collection (Courier)

`POST /api/orders/{orderId}/cod/collect`
Headers: `Authorization: Bearer <courier-jwt>`
Body:

```json
{ "amountCollected": 500, "collectorId": "courier_12" }
```

**200 OK**

```json
{
  "orderId": "...",
  "paymentStatus": "COD_COLLECTED",
  "cod": { "amountCollected": 500, "collectorId": "courier_12", "collectedAt": "2025-08-10T10:30:22Z" }
}
```

**403** (not assigned)

```json
{ "error":"Courier not assigned to this order" }
```

**409** (already collected)

```json
{ "error":"COD already collected for this order" }
```

### 3) Read COD Summary (Backoffice)

`GET /api/orders/{orderId}/cod`
**200 OK**

```json
{
  "orderId": "...",
  "paymentMode": "COD",
  "paymentStatus": "COD_COLLECTED",
  "codAmount": 500,
  "collections": [
    {"amountCollected": 500, "collectorId": "courier_12", "collectedAt": "..."}
  ]
}
```

---

## 🧪 Validation Rules

* `paymentMode` ∈ {`PREPAID`, `COD`}.
* If `paymentMode=COD` → `codAmount` **required** and `codAmount > 0`.
* `amountCollected` must be `>= codAmount` (configurable to allow partials if business allows; default **no partials**).
* Courier must be **assigned to order** and order must be in `OUT_FOR_DELIVERY` or `DELIVERED_PENDING_COD` state (configurable).

---

## 🔐 AuthZ Matrix

| Endpoint                            | Roles                                                           |
| ----------------------------------- | --------------------------------------------------------------- |
| `POST /api/orders`                  | `STAFF`, `ADMIN`                                                |
| `POST /api/orders/{id}/cod/collect` | `COURIER` (assigned only)                                       |
| `GET /api/orders/{id}/cod`          | `STAFF`, `ADMIN` (customer read allowed for summary if desired) |

---

## ⏱️ Rate Limits & Idempotency

* `POST /api/orders/{id}/cod/collect`: **5/min per courier**; include `Idempotency-Key` header to guard retries.
* Server enforces one successful collection per order; duplicate requests with same idempotency key → 200 echo.

---

## 🗃️ DB & Indexing (reference)

* **orders**: `payment_mode VARCHAR(20)`, `payment_status VARCHAR(20)`, `cod_amount NUMERIC(10,2)`, `is_cod_collected BOOL`.
* **cod\_collections**: `order_id UUID`, `collector_id UUID`, `amount_collected NUMERIC(10,2)`, `collected_at TIMESTAMPTZ`.
* Indexes: `idx_orders_payment_status`, `idx_cod_order (order_id)`. Optional unique: `UNIQUE(order_id)` in `cod_collections` if no partials.

---

## 🖥️ Frontend Components (scaffold)

* `<CodToggle/>` – toggles mode; reveals `<CurrencyAmountInput name="codAmount"/>`.
* `<CodCollectForm orderId/>` – for courier app; shows required amount, input, submit; handles 403/409.
* State machine: `IDLE → SUBMITTING → SUCCESS|ERROR`; retry with backoff on network errors.

---

## 🔁 Status Lifecycle (business)

`COD_PENDING` → (courier collects) → `COD_COLLECTED`.

* Optional: `DELIVERED_PENDING_COD` intermediate state if delivery event occurs before cash.

---

## 🧰 Postman / QA Checklist

* Create order with COD; assert 201 & fields.
* Collect COD as assigned courier; assert 200 & status change.
* Repeat collect → expect 409.
* Unassigned courier → 403.
* Negative/zero `codAmount` → 400.

---
