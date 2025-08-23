import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const resolvedParams = await params
    const orderNumber = resolvedParams.orderNumber

    const order = await prisma.order.findUnique({
      where: {
        orderNumber: orderNumber
      },
      include: {
        service: true,
        items: {
          include: {
            product: true
          }
        },
        payment: true
      }
    })

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Order not found'
      }, { status: 404 })
    }

    // Calculate expiry time (15 minutes after creation)
    const expiryTime = new Date(order.createdAt.getTime() + 15 * 60 * 1000)

    const orderDetails = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      customerData: order.customerData,
      createdAt: order.createdAt.toISOString(),
      expiredAt: expiryTime.toISOString(),
      service: order.service,
      items: order.items,
      payment: order.payment
    }

    return NextResponse.json({
      success: true,
      data: orderDetails
    })

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get order'
    }, { status: 500 })
  }
}
