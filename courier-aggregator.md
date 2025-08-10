# Courier Aggregators – Shiprocket & Delhivery (Frontend vs Backend Tasks)

This plan separates work for **A) Shiprocket**, **B) Delhivery**, and **C) Aggregator Switch**. It includes API contracts, payloads, security, data model, webhooks/polling, QA scenarios, and definition of done for interns.

> Notes: Keep tenant separation (company\_id from JWT). Use feature flags to enable/disable providers per company.

---

## A) 📦 Shiprocket Integration Scaffold

### Frontend Tasks

* **SR-F1. Company Settings UI**

  * Admin page: toggle **Enable Shiprocket** per company, fields for **API Key/Secret**, **Pickup Location Code**, **Default Service Type**, **COD support**.
  * Client-side validation and masked secret fields.
* **SR-F2. Order Create Flow (Staff)**

  * When provider = Shiprocket, display **weight (kg)**, **package dimensions**, and **pickup location** selector.
  * After order creation, show **“Create Shipment (Shiprocket)”** action button.
* **SR-F3. Shipment Detail View**

  * Display external **AWB**, **tracking link**, **current status**, **last updated**. Deep link to provider tracking.
* **SR-F4. Error States**

  * Map common provider errors (invalid pincode, weight missing) to UX-friendly messages.

### Backend Tasks

* **SR-B1. Config & Secrets**

  * Entity: `company_courier_settings(company_id, provider, enabled, api_key, api_secret, pickup_code, default_service, supports_cod)`.
  * Encrypt `api_secret` at rest; mask in responses.
* **SR-B2. Auth Client**

  * Token retrieval/refresh client; cache token (TTL from response).
* **SR-B3. Shipment Create Service**

  * `ShiprocketService.createShipment(orderId, payload)` → returns `{awb, trackingUrl, providerShipmentId}`.
  * Validate required fields (phone, weight, address, pincode, pickup\_code).
* **SR-B4. Persistence**

  * `external_shipments(id, order_id, provider, provider_shipment_id, awb, tracking_url, status, raw_request, raw_response, created_at)`.
* **SR-B5. Status Sync**

  * Webhook endpoint (preferred) + polling fallback (cron every 15 min) to refresh statuses.
* **SR-B6. Error Mapping**

  * Normalize provider error codes to internal error enum.

#### Admin Settings API

* `GET /api/admin/courier-settings` – list providers (tenant scope)
* `PUT /api/admin/courier-settings/shiprocket` – upsert settings

```json
{
  "enabled": true,
  "apiKey": "...",
  "apiSecret": "...",
  "pickupCode": "MAIN_WH",
  "defaultService": "STANDARD",
  "supportsCod": true
}
```

#### Create Shipment API (Server)

* `POST /api/aggregators/shiprocket/shipments`

```json
{
  "orderId": "ORD12345",
  "pickupLocation": "Main Warehouse",
  "weight": 2.5,
  "dimensions": {"l":30,"w":20,"h":10},
  "email": "bob@example.com"
}
```

**201 Created**

```json
{
  "orderId":"ORD12345",
  "provider":"SHIPROCKET",
  "awb":"AWB1234567",
  "trackingUrl":"https://track.shiprocket.in/shipment/AWB1234567",
  "providerShipmentId":"78910"
}
```

#### Webhook (Status Update)

* `POST /api/aggregators/shiprocket/webhook`

```json
{
  "provider":"SHIPROCKET",
  "providerShipmentId":"78910",
  "awb":"AWB1234567",
  "status":"IN_TRANSIT",
  "eventTs":"2025-08-10T09:40:00Z"
}
```

**200 OK** → persist and fan-out to tracking events.

---

## B) 🚀 Delhivery Integration Scaffold

### Frontend Tasks

* **DL-F1. Company Settings UI**

  * Toggle **Enable Delhivery**, inputs for **Client ID/Token**, **Pickup Location**, **Product Type**, **COD support**.
* **DL-F2. Order Create Enhancements**

  * Show required fields for Delhivery: **phone, weight, content, pincode**. Validate and assist with hints.
* **DL-F3. Shipment Detail View**

  * Show **AWB**, **tracking URL**, **status** like Shiprocket.

### Backend Tasks

* **DL-B1. Auth & Client**

  * Token-based authentication; handle expiry, retries with backoff.
* **DL-B2. Shipment Create Service**

  * `DelhiveryService.createShipment(orderId, payload)` → returns `{awb, trackingUrl, providerShipmentId}`.
* **DL-B3. Persistence**

  * Reuse `external_shipments` table with `provider = DELHIVERY`.
* **DL-B4. Status Sync**

  * Webhook endpoint + polling job.
* **DL-B5. Validation**

  * Validate phone formats, pincode, weight, package content rules.

#### Create Pickup/Shipment API (Server)

* `POST /api/aggregators/delhivery/shipments`

```json
{
  "orderId": "ORD12345",
  "pickupLocation": {"name":"Saurabh Warehouse","city":"Pune","pincode":"411001"},
  "package": {"weight":1.2,"content":"Documents"},
  "customer": {"name":"Alice","phone":"9876543210","address":"123 A St","city":"Mumbai","pincode":"400001"}
}
```

**201 Created**

```json
{
  "orderId":"ORD12345",
  "provider":"DELHIVERY",
  "awb":"DLV-998877",
  "trackingUrl":"https://www.delhivery.com/track/DLV-998877",
  "providerShipmentId":"A1B2C3"
}
```

#### Webhook (Status Update)

* `POST /api/aggregators/delhivery/webhook`

```json
{
  "provider":"DELHIVERY",
  "providerShipmentId":"A1B2C3",
  "awb":"DLV-998877",
  "status":"OUT_FOR_DELIVERY",
  "eventTs":"2025-08-10T10:05:00Z"
}
```

---

## C) 🔁 Aggregator Switch & Abstraction

### Backend Architecture

* **Interface** `CourierProviderService`

```java
public interface CourierProviderService {
  Provider getProvider(); // INTERNAL, SHIPROCKET, DELHIVERY
  ShipmentResponse createShipment(CreateShipmentCommand cmd);
  void handleWebhookStatus(ProviderWebhookEvent event);
  Optional<ShipmentStatus> fetchStatus(String providerShipmentId);
}
```

* **Implementations**

  * `InternalCourierService` (no external call; generate local AWB)
  * `ShiprocketService`
  * `DelhiveryService`
* **Factory/Router**

  * `CourierProviderRouter.resolve(companyId)` selects an active provider by company settings; override per-order if needed.
* **Entities**

  * `external_shipments` (shared):

    * `id, order_id, provider, provider_shipment_id, awb, tracking_url, status, raw_request, raw_response, created_at, updated_at`
* **Admin Setting**

  * `default_provider` at company level: `INTERNAL|SHIPROCKET|DELHIVERY`.

### Frontend Admin

* **Provider Selector** with test buttons:

  * "Test Auth", "Create Test Shipment" (sandbox order), "Toggle Webhook Secret".

---

## Shared API Summary

* `GET /api/admin/courier-settings` (tenant-scoped)
* `PUT /api/admin/courier-settings/{provider}` – upsert provider config
* `POST /api/aggregators/{provider}/shipments` – create shipment (server-to-provider)
* `POST /api/aggregators/{provider}/webhook` – provider webhook receiver
* `GET /api/aggregators/{provider}/shipments/{orderId}` – read external shipment record

---

## Data Model Additions

* **`company_courier_settings`**

  * `id UUID PK`, `company_id UUID`, `provider VARCHAR(30)`, `enabled BOOLEAN`,
  * `api_key TEXT`, `api_secret TEXT(ENCRYPTED)`, `pickup_code VARCHAR(60)`, `default_service VARCHAR(60)`, `supports_cod BOOLEAN`,
  * `default_provider` (on one row or in separate `company_preferences`).
* **`external_shipments`**

  * See above (index by `order_id`, `provider`); add unique `(order_id, provider)`.

---

## Security & Compliance

* Secrets stored encrypted; redact in logs.
* Webhooks protected by **HMAC signature** (shared secret per provider + timestamp tolerance).
* All endpoints role-gated: admin/settings (ADMIN), shipments (STAFF/ADMIN), webhooks (public path + signature verification).

---

## Status Sync Strategies

* **Webhook-first.** If webhooks fail or are delayed, run **polling** (cron @ 15 min) for stale records (>30 min without update).
* Publish internal events `ShipmentStatusChanged` → notify customer, update dashboard.

---

## Error Mapping (Normalized)

* `INVALID_ADDRESS`, `INVALID_PINCODE`, `MISSING_PHONE`, `WEIGHT_REQUIRED`, `AUTH_FAILED`, `RATE_LIMITED`, `NETWORK_ERROR`, `UNKNOWN`.

---

## QA Scenarios

1. Enable Shiprocket for Company A, create shipment → AWB + link saved.
2. Disable provider → creation endpoint returns 409/422 with guidance.
3. Delhivery webhook updates status → reflected in order timeline.
4. Error from provider mapped to user-friendly message.
5. Tenant isolation: Company B cannot see Company A shipments.
6. Switch default provider to INTERNAL → local AWB created, no external call.

---

## Definition of Done

* **Shiprocket**: Settings, auth client, create shipment, persist external record, webhook + polling, errors mapped, tests.
* **Delhivery**: Same as above; token-based auth, payload validations.
* **Switch**: Interface + router + admin selector + unit tests per provider.

---

## Example Payloads (from spec)

### Shiprocket Create Payload

```json
{
  "order_id": "ORD12345",
  "pickup_location": "Main Warehouse",
  "delivery_address": {
    "name": "Bob",
    "address": "456 B St",
    "city": "Mumbai",
    "pincode": "400001",
    "phone": "9876543210"
  },
  "weight": 2.5,
  "email": "bob@example.com"
}
```

### Delhivery Pickup/Shipment Payload

```json
{
  "pickup_location": {"name": "Saurabh Warehouse", "city": "Pune", "pincode": "411001"},
  "package": {"weight": 1.2, "content": "Documents", "order_id": "ORD12345"},
  "customer": {"name": "Alice", "phone": "9876543210", "address": "123 A St"}
}
```

---

## Nice-to-have

* Sandbox/test mode toggle per provider (if available).
* Automatic address normalization & pincode validation against provider APIs.
* Dashboard widget: external shipment SLAs, exception alerts.
