import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import CryptoJS from 'crypto-js'

const VIP_API_KEY = process.env.VIP_RESELLER_API_KEY
const VIP_API_ID = process.env.VIP_RESELLER_API_ID

interface VipCallbackPayload {
  // Common fields
  trx_id: string
  status: string
  sn?: string
  note?: string
  
  // Game Feature callback
  data?: string
  zone?: string
  service?: string
  price?: number
  
  // Prepaid callback  
  data_no?: string
  code?: string
  
  // Social Media callback
  quantity?: number
  target?: string
}

/**
 * VIP-Reseller Webhook Handler
 * 
 * Handles real-time callbacks from VIP-Reseller API when order status changes
 * Supports all VIP-Reseller services: Game Feature, Prepaid, Social Media
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const callbackData: VipCallbackPayload = body

    console.log('VIP-Reseller Callback received:', {
      trx_id: callbackData.trx_id,
      status: callbackData.status,
      timestamp: new Date().toISOString()
    })

    // Validate required fields
    if (!callbackData.trx_id || !callbackData.status) {
      console.warn('Invalid callback data: missing trx_id or status')
      return NextResponse.json(
        { success: false, message: 'Invalid callback data' },
        { status: 400 }
      )
    }

    // Verify callback authenticity (optional - implement if VIP-Reseller provides signature)
    const isValid = await verifyCallbackSignature(request, callbackData)
    if (!isValid) {
      console.warn('Invalid callback signature')
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Find the order by external ID
    const order = await prisma.order.findFirst({
      where: { externalId: callbackData.trx_id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      console.warn(`Order not found for trx_id: ${callbackData.trx_id}`)
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Map VIP status to our OrderStatus
    const newStatus = mapVipStatusToOrderStatus(callbackData.status)
    
    // Only update if status has changed
    if (order.status !== newStatus) {
      // Update order status
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: newStatus,
          notes: callbackData.note || callbackData.sn || null,
          updatedAt: new Date()
        }
      })

      // Log the callback for audit trail
      await prisma.webhook.create({
        data: {
          orderId: order.id,
          type: 'ORDER_STATUS_UPDATE',
          source: 'vip-reseller',
          payload: JSON.parse(JSON.stringify(callbackData)),
          processed: true
        }
      })

      // Handle failed orders - restore stock if needed
      if (newStatus === OrderStatus.FAILED || newStatus === OrderStatus.CANCELLED) {
        await handleFailedOrderStock(order)
      }

      console.log(`Order ${order.orderNumber} status updated: ${order.status} → ${newStatus}`)
    }

    // Always return success to VIP-Reseller
    return NextResponse.json({
      success: true,
      message: 'Callback processed successfully',
      trx_id: callbackData.trx_id
    })

  } catch (error) {
    console.error('VIP-Reseller Callback Error:', error)
    
    // Log error but still return 200 to prevent callback retries
    try {
      await prisma.webhook.create({
        data: {
          type: 'ORDER_STATUS_UPDATE',
          source: 'vip-reseller',
          payload: JSON.parse(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString(),
            body: await request.clone().json().catch(() => ({}))
          })),
          processed: false
        }
      })
    } catch (logError) {
      console.error('Failed to log callback error:', logError)
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 200 }) // Return 200 to prevent callback retries
  }
}

/**
 * Verify callback signature (implement based on VIP-Reseller documentation)
 */
async function verifyCallbackSignature(
  request: NextRequest, 
  callbackData: VipCallbackPayload
): Promise<boolean> {
  try {
    // VIP-Reseller might send signature in headers or body
    const signature = request.headers.get('x-vip-signature') || 
                     request.headers.get('signature')

    if (!signature) {
      // If no signature verification is implemented by VIP-Reseller, return true
      return true
    }

    // Example signature verification (adjust based on VIP-Reseller specs)
    // const expectedSignature = CryptoJS.MD5(
    //   callbackData.trx_id + callbackData.status + VIP_API_KEY
    // ).toString()

    // return signature === expectedSignature
    return true
  } catch (error) {
    console.error('Signature verification failed:', error)
    return false
  }
}

/**
 * Map VIP-Reseller status to our OrderStatus enum
 */
function mapVipStatusToOrderStatus(vipStatus: string): OrderStatus {
  const status = vipStatus.toLowerCase()
  
  switch (status) {
    case 'success':
    case 'completed':
    case 'delivered':
      return OrderStatus.SUCCESS
      
    case 'failed':
    case 'error':
    case 'rejected':
      return OrderStatus.FAILED
      
    case 'cancelled':
    case 'canceled':
      return OrderStatus.CANCELLED
      
    case 'refunded':
      return OrderStatus.REFUNDED
      
    case 'pending':
    case 'processing':
    case 'waiting':
    default:
      return OrderStatus.PROCESSING
  }
}

/**
 * Handle stock restoration for failed orders
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleFailedOrderStock(order: any) {
  try {
    for (const item of order.items) {
      const product = item.product
      
      // Only restore stock for LIMITED stock type products
      if (product.stockType === 'LIMITED') {
        const newStock = (product.stock || 0) + item.quantity
        
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            stock: newStock,
            updatedAt: new Date()
          }
        })

        // Log stock restoration
        await prisma.stockHistory.create({
          data: {
            productId: product.id,
            type: 'RESTOCK',
            quantity: item.quantity,
            oldStock: product.stock || 0,
            newStock: newStock,
            reason: `Order failed: ${order.orderNumber} - stock restored`,
            userId: null // System restore
          }
        })

        console.log(`Stock restored for product ${product.name}: +${item.quantity} (${product.stock} → ${newStock})`)
      }
    }
  } catch (error) {
    console.error('Failed to restore stock for failed order:', error)
  }
}

/**
 * GET endpoint for webhook status/testing
 */
export async function GET() {
  return NextResponse.json({
    service: 'VIP-Reseller Webhook',
    status: 'active',
    timestamp: new Date().toISOString(),
    supported_callbacks: [
      'Game Feature orders',
      'Prepaid orders (pulsa, PPOB)',
      'Social Media orders'
    ]
  })
}
