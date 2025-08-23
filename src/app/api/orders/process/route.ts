import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vipResellerAPI } from '@/lib/vip-reseller'
import { vipSyncService } from '@/lib/services/vip-sync'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { orderNumber } = body

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Order number is required' },
        { status: 400 }
      )
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: {
              include: {
                service: true
              }
            }
          }
        },
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if order is paid and ready for processing
    if (order.status !== OrderStatus.WAITING_PAYMENT && order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { success: false, message: 'Order is not ready for processing' },
        { status: 400 }
      )
    }

    // Check if payment is completed (if payment method is not balance)
    if (order.payment && order.payment.status !== 'SETTLEMENT') {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Process each order item
    const results = []
    let allSuccess = true

    for (const orderItem of order.items) {
      const product = orderItem.product
      
      // Check stock availability
      const hasStock = await vipSyncService.checkProductStock(product.id, orderItem.quantity)
      if (!hasStock) {
        allSuccess = false
        results.push({
          product: product.name,
          success: false,
          error: 'Insufficient stock'
        })
        continue
      }

      try {
        // Reduce stock first
        const stockReduced = await vipSyncService.reduceStock(
          product.id, 
          orderItem.quantity, 
          order.orderNumber
        )

        if (!stockReduced) {
          allSuccess = false
          results.push({
            product: product.name,
            success: false,
            error: 'Failed to reduce stock'
          })
          continue
        }

        // Create order with VIP-Reseller
        const customerData = order.customerData as any
        
        const vipOrderData = {
          type: 'order' as const,
          service: product.sku, // VIP-Reseller product code
          data_no: customerData.userId || customerData.gameId || customerData.phoneNumber,
          data_zone: customerData.zone || customerData.serverId || undefined
        }

        const vipResponse = await vipResellerAPI.createOrder(vipOrderData)
        
        if (vipResponse.result) {
          results.push({
            product: product.name,
            success: true,
            trxId: vipResponse.data.trxid,
            status: vipResponse.data.status,
            sn: vipResponse.data.sn
          })

          // Update order with external transaction ID
          await prisma.order.update({
            where: { id: order.id },
            data: {
              externalId: vipResponse.data.trxid,
              status: OrderStatus.PROCESSING,
              updatedAt: new Date()
            }
          })
        } else {
          allSuccess = false
          results.push({
            product: product.name,
            success: false,
            error: vipResponse.message
          })

          // Restore stock if order failed
          await vipSyncService.updateProductStock(
            product.id,
            (product.stock || 0) + orderItem.quantity,
            `Order failed: ${order.orderNumber} - stock restored`
          )
        }
      } catch (error) {
        allSuccess = false
        results.push({
          product: product.name,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })

        // Restore stock if order failed
        await vipSyncService.updateProductStock(
          product.id,
          (product.stock || 0) + orderItem.quantity,
          `Order error: ${order.orderNumber} - stock restored`
        )
      }
    }

    // Update order status based on results
    const finalStatus = allSuccess ? OrderStatus.PROCESSING : OrderStatus.FAILED
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: finalStatus,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess 
        ? 'Order processed successfully'
        : 'Order processing completed with some failures',
      data: {
        orderNumber: order.orderNumber,
        status: finalStatus,
        results
      }
    })
  } catch (error) {
    console.error('Order processing error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const trxId = searchParams.get('trxId')

    if (trxId) {
      // Check order status from VIP-Reseller
      try {
        const statusResponse = await vipResellerAPI.getOrderStatus(trxId)
        
        if (statusResponse.result) {
          // Update local order status
          const order = await prisma.order.findFirst({
            where: { externalId: trxId }
          })

          if (order) {
            let newStatus = OrderStatus.PROCESSING
            
            switch (statusResponse.data.status.toLowerCase()) {
              case 'success':
              case 'completed':
                newStatus = OrderStatus.SUCCESS
                break
              case 'failed':
              case 'error':
                newStatus = OrderStatus.FAILED
                break
              case 'cancelled':
                newStatus = OrderStatus.CANCELLED
                break
            }

            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: newStatus,
                notes: statusResponse.data.note || statusResponse.data.sn,
                updatedAt: new Date()
              }
            })
          }

          return NextResponse.json({
            success: true,
            data: statusResponse.data
          })
        } else {
          return NextResponse.json({
            success: false,
            message: statusResponse.message
          })
        }
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'Failed to check order status',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    if (orderNumber) {
      // Get local order details
      const order = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          items: {
            include: {
              product: true
            }
          },
          payment: true
        }
      })

      if (!order) {
        return NextResponse.json(
          { success: false, message: 'Order not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: order
      })
    }

    return NextResponse.json(
      { success: false, message: 'orderNumber or trxId parameter required' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Order status check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
