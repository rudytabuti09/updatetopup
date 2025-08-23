import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { midtransAPI } from '@/lib/midtrans'
import { vipResellerAPI } from '@/lib/vip-reseller'
import type { MidtransNotification } from '@/lib/midtrans'

export async function POST(request: NextRequest) {
  try {
    const notification: MidtransNotification = await request.json()

    // Verify signature
    if (!midtransAPI.verifySignature(notification)) {
      console.error('Invalid Midtrans signature')
      return NextResponse.json({ status: 'error', message: 'Invalid signature' }, { status: 401 })
    }

    const orderId = notification.order_id
    const transactionStatus = notification.transaction_status
    const fraudStatus = notification.fraud_status

    console.log(`Processing Midtrans notification for order ${orderId}: ${transactionStatus}`)

    // Find order by order number (Midtrans order_id)
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderId },
      include: {
        payment: true,
        service: true,
        items: {
          include: {
            product: true
          }
        }
      }
    })

    if (!order) {
      console.error(`Order not found: ${orderId}`)
      return NextResponse.json({ status: 'error', message: 'Order not found' }, { status: 404 })
    }

    // Update payment status
    let newOrderStatus = order.status
    let paymentStatus = order.payment?.status || 'PENDING'

    if (transactionStatus === 'settlement' || (transactionStatus === 'capture' && fraudStatus === 'accept')) {
      // Payment successful
      paymentStatus = 'SETTLEMENT'
      newOrderStatus = 'PROCESSING'

      // Process order with VIP-Reseller
      try {
        const customerData = order.customerData as {
          customerId: string
          nickname?: string
          email: string
          phone: string
        }
        const product = order.items[0]?.product

        if (product) {
          const vipOrder = await vipResellerAPI.createOrder({
            service: product.sku,
            data: customerData.customerId,
            custom: customerData.nickname
          })

          // Update order with external ID
          await prisma.order.update({
            where: { id: order.id },
            data: {
              externalId: vipOrder.data.trxid,
              status: 'PROCESSING'
            }
          })

          console.log(`VIP order created: ${vipOrder.data.trxid} for order ${orderId}`)
        }
      } catch (vipError) {
        console.error('VIP-Reseller order creation failed:', vipError)
        newOrderStatus = 'FAILED'
      }

    } else if (transactionStatus === 'pending') {
      // Payment pending
      paymentStatus = 'PENDING'
      newOrderStatus = 'WAITING_PAYMENT'

    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      // Payment failed
      paymentStatus = 'FAILED'
      newOrderStatus = 'FAILED'

    } else if (transactionStatus === 'failure') {
      // Payment failed
      paymentStatus = 'FAILED'
      newOrderStatus = 'FAILED'
    }

    // Update payment record
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
        status: paymentStatus as 'PENDING' | 'SETTLEMENT' | 'FAILED' | 'EXPIRED' | 'CANCELLED',
          transactionId: notification.transaction_id,
          paymentType: notification.payment_type,
          paidAt: transactionStatus === 'settlement' ? new Date() : null
        }
      })
    }

    // Update order status if changed
    if (newOrderStatus !== order.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: newOrderStatus as 'PENDING' | 'WAITING_PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED',
          updatedAt: new Date()
        }
      })
    }

    // Log webhook event
    await prisma.webhook.create({
      data: {
        orderId: order.id,
        type: 'PAYMENT_NOTIFICATION',
        source: 'midtrans',
        payload: JSON.parse(JSON.stringify(notification)),
        processed: true
      }
    })

    console.log(`Order ${orderId} updated to status: ${newOrderStatus}`)

    return NextResponse.json({ status: 'success' })

  } catch (error) {
    console.error('Midtrans webhook error:', error)

    // Log failed webhook
    try {
      const payload = await request.json()
      await prisma.webhook.create({
        data: {
          type: 'PAYMENT_NOTIFICATION',
          source: 'midtrans',
          payload: JSON.parse(JSON.stringify(payload)),
          processed: false
        }
      })
    } catch (logError) {
      console.error('Failed to log webhook error:', logError)
    }

    return NextResponse.json({ status: 'error', message: 'Webhook processing failed' }, { status: 500 })
  }
}
