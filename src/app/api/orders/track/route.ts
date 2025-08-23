import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'order' or 'email'

    if (!query) {
      return NextResponse.json({
        success: false,
        error: 'Query parameter is required'
      }, { status: 400 })
    }

    let order
    
    if (type === 'email') {
      // Search by email in customerData - using string_contains for SQLite
      order = await prisma.order.findFirst({
        where: {
          customerData: {
            string_contains: `"email":"${query}"`
          }
        },
        include: {
          service: true,
          items: {
            include: {
              product: true
            }
          },
          payment: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Search by order number
      order = await prisma.order.findUnique({
        where: {
          orderNumber: query
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
    }

    if (!order) {
      return NextResponse.json({
        success: false,
        error: 'Pesanan tidak ditemukan'
      }, { status: 404 })
    }

    // Get customer data from JSON field
    const customerData = order.customerData as {
      customerId: string
      nickname?: string
      email: string
      phone: string
    }

    // Create status history (this would typically come from a separate tracking table)
    const statusHistory = [
      {
        status: 'PENDING',
        timestamp: order.createdAt.toISOString(),
        message: 'Pesanan berhasil dibuat'
      }
    ]

    if (order.status !== 'PENDING') {
      statusHistory.push({
        status: order.status,
        timestamp: order.updatedAt.toISOString(),
        message: getStatusMessage(order.status)
      })
    }

    const trackingResult = {
      orderNumber: order.orderNumber,
      status: order.status,
      service: order.service.name,
      product: order.items[0]?.product.name || 'Unknown Product',
      customerId: customerData.customerId,
      nickname: customerData.nickname,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      externalId: order.externalId,
      serialNumber: order.notes, // Assuming serial number is stored in notes
      statusHistory: statusHistory
    }

    return NextResponse.json({
      success: true,
      data: trackingResult
    })

  } catch (error) {
    console.error('Order tracking error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to track order'
    }, { status: 500 })
  }
}

function getStatusMessage(status: string): string {
  switch (status) {
    case 'WAITING_PAYMENT':
      return 'Menunggu pembayaran dari pelanggan'
    case 'PROCESSING':
      return 'Pesanan sedang diproses ke provider'
    case 'SUCCESS':
      return 'Pesanan berhasil diproses, item telah dikirim'
    case 'FAILED':
      return 'Pesanan gagal diproses'
    case 'CANCELLED':
      return 'Pesanan dibatalkan'
    case 'REFUNDED':
      return 'Pesanan dikembalikan'
    default:
      return 'Status tidak dikenal'
  }
}
