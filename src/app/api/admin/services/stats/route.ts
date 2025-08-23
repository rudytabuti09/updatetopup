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

    // Get comprehensive service statistics
    const [
      totalCategories,
      totalServices,
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      categoryStats,
      recentActivity
    ] = await Promise.all([
      // Total categories
      prisma.category.count({ where: { isActive: true } }),
      
      // Total services
      prisma.service.count({ where: { isActive: true } }),
      
      // Total products
      prisma.product.count(),
      
      // Active products
      prisma.product.count({ where: { isActive: true } }),
      
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { totalAmount: true }
      }),
      
      // Category statistics
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              services: { where: { isActive: true } }
            }
          }
        },
        orderBy: { 
          services: { 
            _count: 'desc' 
          } 
        },
        take: 1
      }),
      
      // Recent activity
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        },
        include: {
          service: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    const topCategory = categoryStats[0]?.name || 'N/A'
    
    return NextResponse.json({
      success: true,
      data: {
        totalCategories,
        totalServices,
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        topCategory,
        recentActivity: recentActivity.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          serviceName: order.service.name,
          categoryName: order.service.category.name,
          amount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt
        }))
      }
    })
  } catch (error) {
    console.error('Service stats error:', error)
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
