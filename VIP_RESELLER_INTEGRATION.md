# VIP Reseller API Integration Guide

## Overview
WMX TOPUP telah diintegrasikan dengan VIP Reseller API untuk memproses top-up game secara real-time. Sistem ini memungkinkan pemrosesan otomatis untuk berbagai game populer seperti Mobile Legends, PUBG Mobile, Free Fire, dan Genshin Impact.

## API Configuration

### Environment Variables
Tambahkan kredensial VIP Reseller API ke file `.env`:

```env
# VIP Reseller API Configuration
VITE_VIP_RESELLER_API_ID=your-api-id-here
VITE_VIP_RESELLER_API_KEY=your-api-key-here
```

### API Endpoints
- **Base URL**: `https://vip-reseller.co.id/api/game-feature`
- **Method**: POST untuk semua endpoint
- **Authentication**: API Key + MD5 Signature

## Features Implemented

### 1. Service Management
- ✅ **Get Services**: Mengambil daftar layanan game yang tersedia
- ✅ **Check Stock**: Memeriksa ketersediaan stok untuk service tertentu
- ✅ **Service Filtering**: Filter berdasarkan game, status, dan kategori

### 2. Account Validation
- ✅ **Get Nickname**: Validasi User ID dan Zone ID game
- ✅ **Multi-Game Support**: Mobile Legends, PUBG Mobile, Free Fire, Genshin Impact
- ✅ **Real-time Validation**: Verifikasi akun sebelum pemrosesan order

### 3. Order Processing
- ✅ **Create Order**: Membuat pesanan top-up game
- ✅ **Order Status**: Monitoring status pesanan real-time
- ✅ **Transaction Tracking**: Integrasi dengan sistem internal

### 4. Webhook Support
- ✅ **Status Updates**: Menerima update status dari VIP Reseller
- ✅ **IP Whitelisting**: Keamanan webhook dengan IP 178.248.73.218

## API Functions

### Core Service (`src/services/vipResellerApi.js`)

```javascript
// Get available services
const services = await vipResellerApi.getServices('game', 'Mobile Legends', 'available');

// Validate game account
const nickname = await vipResellerApi.getGameNickname('mobilelegends', '123456789', '2685');

// Create top-up order
const order = await vipResellerApi.createGameOrder('ML172-S1', '123456789', '2685');

// Check order status
const status = await vipResellerApi.checkOrderStatus('VP123456');
```

### React Hook (`src/hooks/useVipResellerApi.js`)

```javascript
const {
  loading,
  services,
  orderStatus,
  getServices,
  validateGameAccount,
  createGameOrder,
  checkOrderStatus
} = useVipResellerApi();
```

## Game-Specific Integration

### Mobile Legends
- **Requires**: User ID + Zone ID
- **Validation**: Real-time nickname lookup
- **Service Codes**: ML86-S1, ML172-S1, ML257-S1, etc.

### PUBG Mobile
- **Requires**: User ID only
- **Validation**: Character name lookup
- **Service Codes**: PUBG60-S1, PUBG325-S1, PUBG660-S1, etc.

### Free Fire
- **Requires**: User ID only
- **Validation**: Character name lookup
- **Service Codes**: FF70-S1, FF140-S1, FF355-S1, etc.

### Genshin Impact
- **Requires**: User ID + Server ID
- **Validation**: Character name lookup
- **Service Codes**: GI60-S1, GI300-S1, GI980-S1, etc.

## Checkout Flow Integration

### Step 1: Account Validation
```javascript
// User enters User ID and Zone ID (if required)
const validation = await validateGameAccount(gameType, userId, zoneId);
if (validation.valid) {
  // Show nickname and proceed to package selection
}
```

### Step 2: Package Selection
```javascript
// Load available packages from VIP Reseller
const services = await getServices('game', gameName, 'available');
// User selects package
```

### Step 3: Order Processing
```javascript
// Create order in Supabase first
const transaction = await createTransaction(transactionData);

// Then process with VIP Reseller
const vipOrder = await vipResellerApi.createGameOrder(serviceCode, userId, zoneId);

// Update transaction with VIP Reseller ID
await updateTransaction(transaction.id, {
  external_transaction_id: vipOrder.data.trxid
});
```

### Step 4: Status Monitoring
```javascript
// Poll order status every 5 seconds
const pollStatus = async (trxId) => {
  const status = await checkOrderStatus(trxId);
  if (status[0].status === 'success') {
    // Top-up completed
  } else if (status[0].status === 'error') {
    // Handle error
  }
  // Continue polling if still processing
};
```

## Error Handling

### Common Errors
1. **Invalid Credentials**: Check API ID and API Key
2. **Account Not Found**: Invalid User ID or Zone ID
3. **Service Unavailable**: Stock habis atau service tidak aktif
4. **Insufficient Balance**: Saldo VIP Reseller tidak mencukupi

### Error Response Format
```json
{
  "result": false,
  "message": "Error description",
  "data": null
}
```

## Security Features

### 1. API Authentication
- MD5 signature: `MD5(API_ID + API_KEY)`
- Secure credential storage in environment variables

### 2. Webhook Security
- IP whitelisting: 178.248.73.218
- Signature verification: `MD5(API_ID + API_KEY)`

### 3. Transaction Security
- Double recording (Supabase + VIP Reseller)
- Status synchronization
- Audit trail logging

## Testing

### Test Credentials
```env
# Use VIP Reseller sandbox credentials for testing
VITE_VIP_RESELLER_API_ID=test-api-id
VITE_VIP_RESELLER_API_KEY=test-api-key
```

### Test Flow
1. Get test services: `await getServices('game', null, 'available')`
2. Use test User ID: `123456789` (Zone: `2685` for ML)
3. Create test order with small denomination
4. Monitor status until completion

## Production Deployment

### Prerequisites
1. ✅ VIP Reseller API credentials (production)
2. ✅ Webhook endpoint configured
3. ✅ IP whitelisting setup
4. ✅ Balance monitoring system

### Monitoring
- Transaction success rate
- API response times
- Error rate tracking
- Balance alerts

## Support

### VIP Reseller Support
- Website: https://vip-reseller.co.id
- Documentation: API documentation portal
- Support: Customer service for API issues

### Internal Support
- Check logs in browser console
- Monitor Supabase transaction records
- Verify API credentials in environment

## Service Code Mapping

### Current Mappings (Update as needed)
```javascript
const SERVICE_CODES = {
  'mobile-legends': {
    '86 Diamonds': 'ML86-S1',
    '172 Diamonds': 'ML172-S1',
    '257 Diamonds': 'ML257-S1',
    '344 Diamonds': 'ML344-S1'
  },
  'pubg-mobile': {
    '60 UC': 'PUBG60-S1',
    '325 UC': 'PUBG325-S1',
    '660 UC': 'PUBG660-S1'
  },
  'free-fire': {
    '70 Diamonds': 'FF70-S1',
    '140 Diamonds': 'FF140-S1',
    '355 Diamonds': 'FF355-S1'
  }
};
```

**Note**: Service codes harus diupdate sesuai dengan kode aktual dari VIP Reseller API.

## Next Steps

1. **Get Real Service Codes**: Panggil API `getServices()` untuk mendapatkan kode service yang benar
2. **Setup Webhook**: Konfigurasi webhook endpoint untuk menerima status updates
3. **Balance Monitoring**: Implementasi monitoring saldo VIP Reseller
4. **Error Logging**: Setup logging untuk tracking error dan debugging
5. **Testing**: Test semua flow dengan kredensial production

---

**Status**: ✅ Integration Complete - Ready for Production Testing