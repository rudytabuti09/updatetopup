# VIP-Reseller API Integration Setup

This guide will help you set up the VIP-Reseller API integration for your WMX Topup platform.

## Prerequisites

1. VIP-Reseller account with API access
2. VIP-Reseller API credentials (API_KEY and API_ID)

## Step 1: Environment Configuration

Add your VIP-Reseller API credentials to your `.env` file:

```env
# VIP-Reseller API Configuration
VIP_RESELLER_API_URL=https://vip-reseller.co.id/api
VIP_RESELLER_API_KEY=your_vip_reseller_api_key_here
VIP_RESELLER_API_ID=your_vip_reseller_api_id_here
```

## Step 2: Database Schema Update

Run the Prisma migrations to add stock management fields:

```bash
# Generate Prisma client with new schema
npm run db:generate

# Push schema changes to database
npm run db:push
```

## Step 3: Initial Data Sync

After setting up your credentials, you can sync data from VIP-Reseller:

1. **Access Admin Panel**: Navigate to `/admin/catalog` (requires admin privileges)

2. **Full Sync**: Click "Full Sync" to import:
   - Services/Games from VIP-Reseller
   - Product catalog with prices
   - Current stock levels

3. **Individual Sync Options**:
   - **Sync Services**: Import available games/services
   - **Sync Products**: Import product catalog and prices
   - **Sync Stock**: Update current stock levels

## Features

### 1. Automatic Product Synchronization
- Import services and products from VIP-Reseller
- Automatically create categories and services
- Sync pricing and product details

### 2. Stock Management
- Real-time stock tracking
- Low stock alerts
- Manual stock adjustments with history
- Automatic stock reduction on orders

### 3. Order Processing Integration
- Automatic order fulfillment with VIP-Reseller
- Stock validation before processing
- Order status synchronization
- Automatic stock restoration on failed orders

### 4. Admin Dashboard
- Comprehensive catalog management
- Stock monitoring and alerts
- Sync status and history
- Product search and filtering

## API Endpoints

### Admin Sync Endpoints
- `POST /api/admin/vip-sync` - Synchronization operations
- `GET /api/admin/stock` - Stock management
- `PUT /api/admin/stock` - Update product stock

### Order Processing
- `POST /api/orders/process` - Process orders with VIP-Reseller
- `GET /api/orders/process` - Check order status

## Stock Types

The system supports three stock types:

1. **UNLIMITED**: Products with unlimited stock (default for digital items)
2. **LIMITED**: Products with specific stock counts
3. **OUT_OF_STOCK**: Temporarily unavailable products

## Stock Management Features

### Automatic Stock Reduction
When an order is placed and paid:
1. System checks stock availability
2. Reduces stock count for LIMITED items
3. Creates stock history entry
4. Processes order with VIP-Reseller

### Stock Alerts
- Low stock warnings when stock ≤ minimum threshold
- Out of stock alerts
- Admin dashboard notifications

### Stock History Tracking
All stock changes are logged with:
- Change type (manual, order, sync)
- Quantity changed
- Previous and new stock levels
- Reason for change
- User who made the change
- Timestamp

## Usage Examples

### 1. Initial Setup and Sync
```javascript
// Full synchronization
const response = await fetch('/api/admin/vip-sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'full-sync' })
})
```

### 2. Update Product Stock
```javascript
// Manual stock update
const response = await fetch('/api/admin/stock', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product-id',
    stock: 100,
    reason: 'Manual restock'
  })
})
```

### 3. Process Order
```javascript
// Process order with VIP-Reseller
const response = await fetch('/api/orders/process', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ orderNumber: 'ORD-123' })
})
```

## Monitoring and Maintenance

### Regular Tasks
1. **Stock Sync**: Run stock sync regularly to keep inventory updated
2. **Low Stock Monitoring**: Check low stock alerts daily
3. **Order Status Updates**: Monitor order processing status

### Troubleshooting

#### Common Issues

1. **Sync Failures**
   - Check API credentials in `.env`
   - Verify VIP-Reseller API status
   - Check network connectivity

2. **Stock Discrepancies**
   - Run stock sync to update from VIP-Reseller
   - Check stock history for changes
   - Verify order processing logs

3. **Order Processing Errors**
   - Check VIP-Reseller API response
   - Verify customer data format
   - Check stock availability

#### Error Handling
- All API calls include proper error handling
- Failed orders automatically restore stock
- Sync errors are logged and displayed in admin panel

## Security Considerations

1. **API Credentials**: Keep your VIP-Reseller credentials secure
2. **Admin Access**: Only admin users can access sync functions
3. **Rate Limiting**: Implement rate limiting for API calls if needed

## Performance Tips

1. **Scheduled Sync**: Set up scheduled stock sync (e.g., every 30 minutes)
2. **Batch Operations**: Use full sync for initial setup, individual syncs for updates
3. **Caching**: Consider caching product data for better performance

## Support

For issues related to:
- VIP-Reseller API: Contact VIP-Reseller support
- Integration bugs: Check error logs and admin dashboard
- Stock discrepancies: Use sync functions and stock history

## Next Steps

After setup:
1. Configure payment methods (Midtrans)
2. Set up automated sync schedules
3. Train staff on admin panel usage
4. Monitor system performance and stock levels
