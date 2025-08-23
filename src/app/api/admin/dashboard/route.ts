import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Insufficient privileges' },
        { status: 403 }
      )
    }

    const now = new Date()
    const todayStart = new Date(now.setHours(0, 0, 0, 0))
    const todayEnd = new Date(now.setHours(23, 59, 59, 999))

    // Get comprehensive dashboard statistics
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      pendingOrders,
      todayOrders,
      successOrders,
      failedOrders,
      totalRevenue,
      todayRevenue,
      systemAlerts,
      recentActivity,
      recentOrders
    ] = await Promise.all([
      // Total users
      prisma.user.count({ where: { role: 'USER' } }),
      
      // Active users (logged in last 7 days or have orders)
      prisma.user.count({
        where: {
          role: 'USER',
          OR: [
            { updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            { orders: { some: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } } }
          ]
        }
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Pending orders
      prisma.order.count({
        where: { 
          status: { in: ['PENDING', 'WAITING_PAYMENT', 'PROCESSING'] } 
        }
      }),
      
      // Today orders
      prisma.order.count({
        where: {
          createdAt: { gte: todayStart, lte: todayEnd }
        }
      }),
      
      // Success orders
      prisma.order.count({
        where: { status: 'SUCCESS' }
      }),
      
      // Failed orders
      prisma.order.count({
        where: { status: 'FAILED' }
      }),
      
      // Total revenue
      prisma.order.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { totalAmount: true }
      }),
      
      // Today revenue
      prisma.order.aggregate({
        where: { 
          status: 'SUCCESS',
          createdAt: { gte: todayStart, lte: todayEnd }
        },
        _sum: { totalAmount: true }
      }),
      
      // System alerts (failed webhooks, pending sync, etc.)
      prisma.webhook.count({
        where: { 
          processed: false,
          createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      }),
      
      // Recent activity (last 20 activities)
      prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          },
          service: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      
      // Recent orders for detailed view
      prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          },
          service: {
            select: { name: true }
          },
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    // Format recent activity
    const formattedActivity = recentActivity.map(order => {
      let description = ''
      let type: 'order' | 'user' | 'payment' | 'system' = 'order'
      let status: 'success' | 'warning' | 'error' = 'success'

      switch (order.status) {
        case 'SUCCESS':
          description = `Order berhasil #${order.orderNumber} dari ${order.user?.email || 'Guest'}`
          type = 'order'
          status = 'success'
          break
        case 'FAILED':
          description = `Order gagal #${order.orderNumber} - ${order.service.name}`
          type = 'order'
          status = 'error'
          break
        case 'PROCESSING':
          description = `Order sedang diproses #${order.orderNumber}`
          type = 'order'
          status = 'warning'
          break
        case 'PENDING':
        case 'WAITING_PAYMENT':
          description = `Order baru #${order.orderNumber} dari ${order.user?.email || 'Guest'}`
          type = 'order'
          status = 'warning'
          break
        default:
          description = `Order #${order.orderNumber} - Status: ${order.status}`
          type = 'order'
      }

      return {
        id: order.id,
        type,
        description,
        timestamp: order.createdAt.toISOString(),
        status
      }
    })

    // Format recent orders
    const formattedOrders = recentOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      user: order.user?.name || order.user?.email || 'Guest',
      service: `${order.service.name} - ${order.items[0]?.product.name || 'Unknown Product'}`,
      amount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString()
    }))

    const stats = {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      pendingOrders,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      activeUsers,
      systemAlerts
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        recentActivity: formattedActivity,
        recentOrders: formattedOrders
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
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
