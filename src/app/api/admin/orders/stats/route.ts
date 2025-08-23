import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized'
      }, { status: 401 })
    }

    // Check if user is admin or super admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      }, { status: 403 })
    }

    // Get today's date for today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate statistics
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      failedOrders,
      totalRevenue,
      todayOrders,
      todayRevenue
    ] = await Promise.all([
      // Total orders
      prisma.order.count(),
      
      // Pending orders
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      
      // Processing orders
      prisma.order.count({
        where: { status: 'PROCESSING' }
      }),
      
      // Completed orders
      prisma.order.count({
        where: { status: 'SUCCESS' }
      }),
      
      // Failed orders
      prisma.order.count({
        where: { status: 'FAILED' }
      }),
      
      // Total revenue (only from paid orders)
      prisma.order.aggregate({
        where: { 
          payment: { status: 'SETTLEMENT' },
          status: { not: 'REFUNDED' }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Today's orders
      prisma.order.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      
      // Today's revenue
      prisma.order.aggregate({
        where: {
          payment: { status: 'SETTLEMENT' },
          status: { not: 'REFUNDED' },
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        },
        _sum: {
          totalAmount: true
        }
      })
    ])

    const stats = {
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      failedOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching order statistics:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
