# 🚀 WMX TOPUP - Complete VIP Reseller Integration Workflow

## 📋 Overview

This document outlines the complete end-to-end workflow for the digital top-up platform that integrates with VIP Reseller API as described in your original request. The system handles the entire process from user product selection to final order completion.

## 🔄 Complete Workflow Steps

### 1. **User Accesses Website** 
- User visits website (wmxtopup.com)
- Home page displays available game categories and popular products
- **Files involved:**
  - `/src/app/page.tsx` - Main landing page
  - `/src/app/catalog/page.tsx` - Product catalog listing

### 2. **Product Selection**
- User selects game/service from catalog
- System displays available products for selected service
- Products are fetched from VIP Reseller API or cached database
- **Files involved:**
  - `/src/app/catalog/[serviceId]/page.tsx` - Service detail page with product selection
  - `/src/app/api/services/route.ts` - API to fetch services and products

### 3. **Order Form Completion**
- User enters required information:
  - User ID / Nickname / Server ID (based on game requirements)
  - Contact information (email, phone)
  - Product selection
- System validates User ID and fetches nickname if supported
- **Files involved:**
  - `/src/components/forms/order-form.tsx` - Reusable order form component
  - `/src/app/api/services/nickname/route.ts` - Nickname validation API

### 4. **Order Creation & Payment**
- System calculates total price (VIP Reseller base price + admin margin)
- Creates order record in database
- Generates Midtrans payment link/token
- User is redirected to payment gateway
- **Files involved:**
  - `/src/app/api/orders/create/route.ts` - Order creation endpoint
  - `/src/lib/midtrans.ts` - Payment gateway integration

### 5. **Payment Processing**
- User completes payment via Midtrans
- Midtrans sends webhook notification to system
- System verifies payment and updates order status
- **Files involved:**
  - `/src/app/api/webhooks/midtrans/route.ts` - Payment webhook handler

### 6. **VIP Reseller Order Creation**
- Once payment is confirmed, system automatically creates order with VIP Reseller
- Sends request with:
  ```json
  {
    "type": "order",
    "service": "MLGLOBAL22590-S14", // VIP product code
    "data_no": "123456789",         // User ID
    "data_zone": "1234"             // Server ID (if required)
  }
  ```
- **Files involved:**
  - `/src/lib/vip-reseller.ts` - VIP Reseller API client
  - Webhook handler processes and creates VIP order

### 7. **Order Status Monitoring**
- System periodically checks order status from VIP Reseller
- Updates local order status based on VIP response
- Automated sync service runs every few minutes
- **Files involved:**
  - `/src/lib/services/vip-status-sync.ts` - Status synchronization service
  - `/src/app/api/admin/sync-status/route.ts` - Manual and automated sync API

### 8. **Order Completion**
- When VIP Reseller completes order (status: 'success'), local status updates to SUCCESS
- User receives confirmation via email/notification
- **Files involved:**
  - Status sync service handles final status updates

## 🗃️ Database Schema

The system uses the following main entities:

```prisma
model Order {
  id            String      @id @default(cuid())
  orderNumber   String      @unique
  userId        String?
  serviceId     String
  customerData  Json        // User ID, nickname, phone, etc
  totalAmount   Float
  status        OrderStatus
  externalId    String?     // VIP Reseller transaction ID
  // ... other fields
}

model Product {
  id          String  @id @default(cuid())
  name        String
  price       Float   // Selling price (with margin)
  buyPrice    Float   // Cost from VIP Reseller
  profit      Float   // Admin margin
  sku         String  // VIP Reseller product code
  // ... other fields
}
```

## 🔧 API Endpoints

### Core Endpoints
- `GET /api/services` - Get all services and products
- `POST /api/services?action=sync` - Sync products from VIP Reseller
- `POST /api/orders/create` - Create new order
- `GET/POST /api/orders/process` - Process orders with VIP Reseller
- `POST /api/webhooks/midtrans` - Handle payment notifications

### Admin Endpoints  
- `POST /api/admin/sync-status?action=sync-all` - Sync all order statuses
- `GET /api/admin/sync-status?key=CRON_SECRET` - Automated cron sync

## ⚙️ Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wmx_topup"

# VIP-Reseller API
VIP_RESELLER_API_URL="https://vip-reseller.co.id/api"
VIP_RESELLER_API_KEY="your_api_key"
VIP_RESELLER_API_ID="your_api_id"

# Midtrans Payment
MIDTRANS_SERVER_KEY="your_server_key"
MIDTRANS_CLIENT_KEY="your_client_key"
MIDTRANS_IS_PRODUCTION=false

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="your_secret_key"

# Cron Job Security
CRON_SECRET_KEY="your_cron_secret"
```

## 🚀 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Sync Products from VIP Reseller
```bash
# Via API call or admin panel
curl -X POST "http://localhost:3000/api/services?action=sync" \
  -H "Authorization: Bearer admin_token"
```

### 5. Start Development Server
```bash
npm run dev
```

## 🔄 Automated Status Sync

Set up a cron job to automatically sync order statuses:

```bash
# Add to crontab (runs every 5 minutes)
*/5 * * * * curl "http://localhost:3000/api/admin/sync-status?key=YOUR_CRON_SECRET"
```

## 📊 Order Status Flow

```
PENDING → WAITING_PAYMENT → PROCESSING → SUCCESS/FAILED
    ↓           ↓              ↓           ↓
Created    Payment Sent   VIP Order    Final Status
Order      to Gateway     Created      from VIP
```

## 🛠️ Key Features Implemented

✅ **Complete VIP Reseller Integration**
- Product sync from VIP API
- Order creation with VIP
- Status monitoring and updates

✅ **Payment Gateway Integration**
- Midtrans integration
- Webhook handling
- Payment verification

✅ **Order Management**
- Complete order lifecycle
- Status tracking
- Customer notifications

✅ **Admin Features**
- Manual status sync
- Order monitoring
- Product management

✅ **User Interface**
- Responsive design
- Product catalog
- Order forms
- Status tracking

## 📱 User Journey Example

1. **User visits**: wmxtopup.com
2. **Selects**: Mobile Legends → 86 Diamonds
3. **Enters details**: User ID `123456789(1234)`, email, phone
4. **Pays**: Via Midtrans (QRIS/Bank Transfer/etc)
5. **System processes**: Creates VIP order automatically
6. **Completion**: Diamonds delivered to game account
7. **Notification**: User receives confirmation

## 🔧 Troubleshooting

### Common Issues

1. **VIP API Connection Failed**
   - Check API credentials in environment variables
   - Verify API endpoint URL
   - Test connection with `/api/test/vip-connection`

2. **Payment Webhook Not Working**
   - Verify Midtrans webhook URL configuration
   - Check server key matches
   - Monitor webhook logs in database

3. **Orders Stuck in PROCESSING**
   - Run manual status sync: `POST /api/admin/sync-status?action=sync-all`
   - Check VIP Reseller order status manually
   - Review order external IDs

## 📞 Support

For technical support:
1. Check existing issues in the codebase
2. Review API logs in `/src/app/api/*/route.ts` files
3. Monitor database webhook entries for debugging
4. Use admin panel for manual interventions

---

**🎉 Your VIP Reseller top-up workflow is now complete and ready for production!**
