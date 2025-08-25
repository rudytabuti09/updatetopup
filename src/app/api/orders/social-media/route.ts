import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vipResellerAPI } from '@/lib/vip-reseller'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

interface SocialMediaOrderRequest {
  service: string
  target: string // Instagram username, YouTube URL, etc.
  quantity: number
}

/**
 * Create Social Media Order (Followers, Likes, Views, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { service, target, quantity }: SocialMediaOrderRequest = body

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!service || !target || !quantity) {
      return NextResponse.json(
        { success: false, message: 'Service, target, and quantity are required' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { success: false, message: 'Quantity must be greater than 0' },
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

    // For social media, we typically use the base price and multiply by quantity
    // Or use a different pricing model based on quantity ranges
    const selectedProduct = serviceDetails.products[0]
    const totalPrice = selectedProduct.price * quantity

    // Basic quantity validation
    if (quantity > 10000) {
      return NextResponse.json(
        { success: false, message: 'Maximum order quantity is 10000' },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `SMO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

    // Create order in database first
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        serviceId: serviceDetails.id,
        status: OrderStatus.PENDING,
        totalAmount: totalPrice,
        customerData: {
          target,
          quantity,
          service: serviceDetails.name,
          platform: serviceDetails.provider
        },
        items: {
          create: [{
            productId: selectedProduct.id,
            quantity,
            price: selectedProduct.price,
            total: totalPrice
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
        quantity,
        data: target
      }

      const vipResponse = await vipResellerAPI.createSocialMediaOrder(vipOrderData)
      
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
            target,
            quantity,
            totalPrice,
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
    console.error('Social media order creation error:', error)
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
 * Get Social Media Order Status
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
        const statusResponse = await vipResellerAPI.getSocialMediaOrderStatus(trxId)
        
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
              target: vipOrder.data,
              service: vipOrder.service,
              quantity: vipOrder.quantity,
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
    console.error('Social media status check error:', error)
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
    case 'delivered':
      return OrderStatus.SUCCESS
      
    case 'failed':
    case 'error':
    case 'rejected':
      return OrderStatus.FAILED
      
    case 'cancelled':
    case 'canceled':
      return OrderStatus.CANCELLED
      
    case 'pending':
    case 'processing':
    case 'waiting':
    case 'in progress':
    default:
      return OrderStatus.PROCESSING
  }
}
