# LEAP Networks – Founders Connect Ticketing System

A production-structured event ticket purchasing and payment gateway for the **LEAP Networks: FOUNDERS CONNECT** summit (10 October 2026 at August Loft Water Falls).

Built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Node.js/Express**, and the official **Lipila API**.

---

## 🏛️ Architecture Overview

```
                      +-----------------------------+
                      |          CUSTOMER           |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |    FRONTEND (Next.js 15)    |
                      |  - Event Hero & Speakers    |
                      |  - Ticket Checkout Form     |
                      |  - Live Status Poller       |
                      |  - Printable / QR Digital   |
                      +--------------+--------------+
                                     | (REST API)
                                     v
                      +-----------------------------+
                      |   BACKEND API (Express/TS)  |
                      |  - Validation (Zod)         |
                      |  - Server Price Calculation |
                      |  - Payment Service          |
                      |  - Ticket Generator (QR)    |
                      |  - Idempotent Webhook       |
                      +--------------+--------------+
                                     | (x-api-key)
                                     v
                      +-----------------------------+
                      |      LIPILA GATEWAY         |
                      |  - Mobile Money (Zambia)    |
                      |    (Airtel, MTN, Zamtel)    |
                      |  - Card Collections         |
                      +-----------------------------+
```

### Security & Integrity Principles
- **No Secret Keys on Frontend:** All Lipila API keys and webhook secrets reside strictly on the backend.
- **Server-Authoritative Pricing:** The backend independently calculates amounts (`K500 × quantity`). The frontend cannot manipulate ticket prices.
- **Post-Payment Ticket Generation:** Tickets and tokens are issued **only** after confirmed `SUCCESSFUL` payment callbacks from Lipila.
- **Idempotent Webhooks:** Repeated webhook deliveries from Lipila will not generate duplicate tickets or tokens.
- **Extensible Architecture:** In-memory repository abstractions (`IPaymentRepository`, `ITicketService`, `ILipilaService`) are structured to plug in PostgreSQL, MongoDB, Prisma, Redis, or email queues without refactoring payment endpoints.

---

## 📅 Event Summary

| Attribute | Details |
|---|---|
| **Event Name** | LEAP NETWORKS – FOUNDERS CONNECT |
| **Date** | 10 October 2026 |
| **Time** | 12:00 PM – 10:00 PM |
| **Venue** | August Loft Water Falls, Lusaka, Zambia |
| **Ticket Price** | **K500** (ZMW) per attendee |
| **Contact Hotline** | `0979333751` / `connect@leapnetworks.org` |
| **Featured Speakers** | • **Dr David Nama** – Chairman, Dana Group<br>• **Kenneth Obiajulu** – Co-Founder, Agricop<br>• **Peter Nyumbu** – Business Strategist<br>• **Zindaba Hanzala** – Mulimi Founder<br>• **Mr Njekwa Anamela** – LEAP Chairman |
| **Social / Online** | `@Leapnetworks` (X, Facebook, Instagram, YouTube) |
| **Partners** | MULIMI, NK Legal, Biroc Corporations, SB (Solly & Brothers), Ignis Globus |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** (v18+ recommended, v20+ supported)
- **npm** (v9+)

### 2. Installation
Install dependencies for both backend and frontend:
```bash
# Install all workspace dependencies
npm run install:all
```
*(Or navigate into `/backend` and `/frontend` and run `npm install` in each).*

### 3. Environment Configuration
Copy `.env.example` to `.env` in the `backend/` directory:

```bash
# In backend/
cp .env.example .env
```

Configure your variables:
```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Lipila Gateway Credentials (https://dashboard.lipila.dev)
LIPILA_API_KEY=your_lipila_api_key_here
LIPILA_BASE_URL=https://api.lipila.dev/api/v1
LIPILA_WEBHOOK_SECRET=your_webhook_secret_here
LIPILA_CALLBACK_URL=http://localhost:5000/api/webhooks/lipila

# Security Salt
TICKET_SECRET=leap_founders_connect_2026_salt_token

# Sandbox Simulator Toggle
SIMULATE_LIPILA_SANDBOX=true
```

### 4. Running the Application

Open two terminal windows or run:

**Backend (API Server):**
```bash
npm run dev:backend
# API running at http://localhost:5000
```

**Frontend (Next.js Application):**
```bash
npm run dev:frontend
# App accessible at http://localhost:3000
```

---

## 📡 Backend REST API Endpoints

### 1. Initiate Payment
- **Endpoint:** `POST /api/payments`
- **Headers:** `Content-Type: application/json`
- **Payload:**
```json
{
  "fullName": "John Banda",
  "email": "john@example.com",
  "phone": "0979333751",
  "quantity": 2,
  "paymentMethod": "MOBILE_MONEY"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "reference": "d747a86f-5b12-421b-80a5-f86a247247ea",
  "amount": 1000,
  "unitPrice": 500,
  "quantity": 2,
  "currency": "ZMW",
  "status": "PENDING",
  "paymentMethod": "MOBILE_MONEY",
  "cardRedirectionUrl": null,
  "message": "Payment prompt sent to your phone. Please approve the prompt with your PIN.",
  "lipilaDetails": {
    "paymentType": "AirtelMoney",
    "status": "Pending"
  }
}
```

---

### 2. Check Payment Status & Fetch Ticket
- **Endpoint:** `GET /api/payments/:reference/status`
- **Response (`200 OK` - Pending):**
```json
{
  "success": true,
  "reference": "d747a86f-5b12-421b-80a5-f86a247247ea",
  "status": "PENDING",
  "amount": 1000,
  "currency": "ZMW",
  "customerName": "John Banda",
  "quantity": 2
}
```
- **Response (`200 OK` - Confirmed Successful):**
```json
{
  "success": true,
  "reference": "d747a86f-5b12-421b-80a5-f86a247247ea",
  "status": "SUCCESSFUL",
  "amount": 1000,
  "currency": "ZMW",
  "customerName": "John Banda",
  "quantity": 2,
  "ticket": {
    "ticketToken": "LEAP-2026-8F42K91X",
    "eventName": "LEAP NETWORKS – FOUNDERS CONNECT",
    "eventDate": "10 October 2026",
    "eventTime": "12:00 PM – 10:00 PM",
    "eventVenue": "August Loft Water Falls",
    "customerName": "John Banda",
    "customerEmail": "john@example.com",
    "customerPhone": "0979333751",
    "quantity": 2,
    "unitPrice": 500,
    "amountPaid": 1000,
    "currency": "ZMW",
    "paymentReference": "d747a86f-5b12-421b-80a5-f86a247247ea",
    "paymentStatus": "SUCCESSFUL",
    "qrCodeDataUrl": "data:image/png;base64,...",
    "qrPayload": "{\"token\":\"LEAP-2026-8F42K91X\",\"event\":\"...\"}",
    "issuedAt": "2026-10-10T14:30:00.000Z"
  }
}
```

---

### 3. Lipila Webhook Callback
- **Endpoint:** `POST /api/webhooks/lipila`
- **Payload:**
```json
{
  "referenceId": "d747a86f-5b12-421b-80a5-f86a247247ea",
  "status": "Successful",
  "amount": 1000,
  "currency": "ZMW",
  "accountNumber": "260979333751",
  "paymentType": "AirtelMoney"
}
```
- **Response (`200 OK`):**
```json
{
  "received": true,
  "success": true,
  "reference": "d747a86f-5b12-421b-80a5-f86a247247ea",
  "status": "SUCCESSFUL",
  "ticketIssued": true
}
```

---

## 💳 Lipila API Integration Details

The Lipila integration logic is completely encapsulated in `backend/src/services/lipilaService.ts`.

### Mobile Money Collection:
- **Endpoint:** `POST https://api.lipila.dev/api/v1/collections/mobile-money`
- **Headers:**
  - `accept: application/json`
  - `Content-Type: application/json`
  - `x-api-key: <YOUR_LIPILA_KEY>`
- **Payload:**
  - `accountNumber`: Formatted to 260 standard (e.g. `260979333751`)
  - `amount`: Backend calculated integer
  - `currency`: `ZMW`
  - `referenceId`: Generated UUID
  - `callbackUrl`: `http://your-server.com/api/webhooks/lipila`

### Card Collection:
- **Endpoint:** `POST https://api.lipila.dev/api/v1/collections/card`
- Returns a `cardRedirectionUrl` which is provided to the user to securely complete 3D Secure bank authentication.

---

## 🎟️ Ticket Generation & Printing

When a payment reaches `SUCCESSFUL` status:
1. `ticketService.generateTicket()` mints a cryptographically secure token formatted as `LEAP-2026-XXXXXXXX` (e.g., `LEAP-2026-8F42K91X`).
2. High-density tamper-evident QR code data is generated containing the token, reference, holder details, and signature.
3. The user can:
   - **Download PDF Ticket:** Uses `html2canvas` and `jsPDF` to generate a high-definition PDF.
   - **Print Ticket:** Dedicated `@media print` CSS cleanly isolates and formats the ticket for physical A4 printing.

---

## 🔮 Future Integration with Full LEAP Networks Platform

The application is structured for clean modular extraction:
- `frontend/src/components/TicketCheckout.tsx` and `DigitalTicket.tsx` can be imported directly into a broader LEAP Networks Next.js application as embedded widgets.
- `backend/src/services/paymentService.ts` implements `IPaymentRepository`, allowing easy replacement of the in-memory map with Prisma ORM, MongoDB, or PostgreSQL.
- Future endpoints for `/events`, `/admin`, and `/verification` can be added to the Express router without modifying the payment and ticket services.
