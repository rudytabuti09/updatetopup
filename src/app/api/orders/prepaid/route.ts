import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vipResellerAPI } from '@/lib/vip-reseller'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

interface PrepaidOrderRequest {
  service: string
  phoneNumber: string
  amount?: number
}

/**
 * Create Prepaid Order (Pulsa, Data Package, PLN, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { service, phoneNumber, amount }: PrepaidOrderRequest = body

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!service || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Service and phone number are required' },
        { status: 400 }
      )
    }

    // Get service details from our database (should be synced from VIP-Reseller)
    const serviceDetails = await prisma.service.findFirst({
      where: { 
        provider: service,
        isActive: true
      },
      include: {
        products: {
          where: { isActive: true },
          orderBy: { price: 'asc' }
        }
      }
    })

    if (!serviceDetails || serviceDetails.products.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Service not available' },
        { status: 404 }
      )
    }

    // Select product based on amount (if provided) or use the first available
    let selectedProduct = serviceDetails.products[0]
    if (amount) {
      const productByAmount = serviceDetails.products.find(p => p.price === amount)
      if (productByAmount) {
        selectedProduct = productByAmount
      }
    }

    // Generate order number
    const orderNumber = `PRE-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        serviceId: serviceDetails.id,
        status: OrderStatus.PENDING,
        totalAmount: selectedProduct.price,
        customerData: {
          phoneNumber,
          service: serviceDetails.name,
          provider: serviceDetails.provider
        },
        items: {
          create: [{
            productId: selectedProduct.id,
            quantity: 1,
            price: selectedProduct.price,
            total: selectedProduct.price
          }]
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    try {
      // Create order with VIP-Reseller
      const vipOrderData = {
        type: 'order' as const,
        service: selectedProduct.sku, // VIP-Reseller product code
        data_no: phoneNumber
      }

      const vipResponse = await vipResellerAPI.createPrepaidOrder(vipOrderData)
      
      if (vipResponse.result) {
        // Update order with external transaction ID
        await prisma.order.update({
          where: { id: order.id },
          data: {
            externalId: vipResponse.data.trxid,
            status: OrderStatus.PROCESSING,
            updatedAt: new Date()
          }
        })

        return NextResponse.json({
          success: true,
          data: {
            orderNumber: order.orderNumber,
            externalId: vipResponse.data.trxid,
            status: 'processing',
            service: serviceDetails.name,
            phoneNumber,
            amount: selectedProduct.price,
            message: vipResponse.message
          }
        })
      } else {
        // VIP order failed, update local order
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: OrderStatus.FAILED,
            notes: vipResponse.message,
            updatedAt: new Date()
          }
        })

        return NextResponse.json({
          success: false,
          message: `Order failed: ${vipResponse.message}`,
          orderNumber: order.orderNumber
        }, { status: 400 })
      }
    } catch (error) {
      // VIP API error, update local order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.FAILED,
          notes: error instanceof Error ? error.message : 'API Error',
          updatedAt: new Date()
        }
      })

      throw error
    }

  } catch (error) {
    console.error('Prepaid order creation error:', error)
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

/**
 * Get Prepaid Order Status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderNumber = searchParams.get('orderNumber')
    const trxId = searchParams.get('trxId')

    if (!orderNumber && !trxId) {
      return NextResponse.json(
        { success: false, message: 'orderNumber or trxId parameter required' },
        { status: 400 }
      )
    }

    if (trxId) {
      // Check status from VIP-Reseller directly
      try {
        const statusResponse = await vipResellerAPI.getPrepaidOrderStatus(trxId)
        
        if (statusResponse.result && statusResponse.data.length > 0) {
          const vipOrder = statusResponse.data[0]
          
          // Update local order if found
          const order = await prisma.order.findFirst({
            where: { externalId: trxId }
          })

          if (order) {
            const newStatus = mapVipStatusToOrderStatus(vipOrder.status)
            
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: newStatus,
                notes: vipOrder.note,
                updatedAt: new Date()
              }
            })
          }

          return NextResponse.json({
            success: true,
            data: {
              trxId: vipOrder.trxid,
              status: vipOrder.status,
              phoneNumber: vipOrder.data,
              service: vipOrder.service,
              price: vipOrder.price,
              note: vipOrder.note,
              createdDate: vipOrder.created_date,
              lastUpdate: vipOrder.last_update
            }
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
          }
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
        data: {
          orderNumber: order.orderNumber,
          externalId: order.externalId,
          status: order.status,
          totalAmount: order.totalAmount,
          customerData: order.customerData,
          items: order.items,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          notes: order.notes
        }
      })
    }

    // Fallback response if neither trxId nor orderNumber processed successfully
    return NextResponse.json(
      { success: false, message: 'Unable to process request' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Prepaid status check error:', error)
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

/**
 * Map VIP-Reseller status to our OrderStatus enum
 */
function mapVipStatusToOrderStatus(vipStatus: string): OrderStatus {
  const status = vipStatus.toLowerCase()
  
  switch (status) {
    case 'success':
    case 'completed':
      return OrderStatus.SUCCESS
      
    case 'failed':
    case 'error':
      return OrderStatus.FAILED
      
    case 'cancelled':
      return OrderStatus.CANCELLED
      
    case 'pending':
    case 'processing':
    default:
      return OrderStatus.PROCESSING
  }
}
