import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

// Cache dashboard data for 30 seconds to reduce database load
const getCachedDashboardStats = unstable_cache(
  async (userId: string) => {
    const [
      totalOrdersResult,
      totalSpentResult,
      pendingOrdersResult,
      successOrdersResult,
      userBalance,
      recentOrders,
      recentTransactions
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({
        where: { userId }
      }),
      
      // Total spent (only successful orders)
      prisma.order.aggregate({
        where: { 
          userId,
          status: 'SUCCESS'
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Pending orders count
      prisma.order.count({
        where: { 
          userId,
          status: {
            in: ['PENDING', 'WAITING_PAYMENT', 'PROCESSING']
          }
        }
      }),
      
      // Success orders count
      prisma.order.count({
        where: { 
          userId,
          status: 'SUCCESS'
        }
      }),
      
      // User balance
      prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        where: { userId },
        include: {
          service: {
            select: {
              name: true,
              logo: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      
      // Recent transactions (last 10)
      prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    return {
      totalOrders: totalOrdersResult,
      totalSpent: totalSpentResult._sum.totalAmount || 0,
      pendingOrders: pendingOrdersResult,
      successOrders: successOrdersResult,
      balance: userBalance?.balance || 0,
      recentOrders: recentOrders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        service: order.items.length > 0 
          ? `${order.service.name} - ${order.items[0].product.name}`
          : order.service.name,
        amount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        serviceLogo: order.service.logo
      })),
      recentTransactions: recentTransactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        createdAt: tx.createdAt.toISOString(),
        balanceBefore: tx.balanceBefore,
        balanceAfter: tx.balanceAfter
      }))
    }
  },
  ['dashboard-stats'],
  {
    revalidate: 30, // Cache for 30 seconds
    tags: ['dashboard']
  }
)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const dashboardData = await getCachedDashboardStats(userId)

    // Add performance timing header
    const headers = new Headers()
    headers.set('X-Cache-Status', 'HIT')
    headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
    
    return NextResponse.json(dashboardData, { headers })

  } catch (error) {
    console.error('Dashboard API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

// Real-time stats endpoint for live updates
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { lastUpdate } = await request.json()
    const userId = session.user.id

    // Only fetch data that might have changed since last update
    const sinceDate = lastUpdate ? new Date(lastUpdate) : new Date(Date.now() - 60000) // Last minute

    const [newOrders, newTransactions, currentBalance] = await Promise.all([
      prisma.order.findMany({
        where: { 
          userId,
          updatedAt: { gt: sinceDate }
        },
        include: {
          service: { select: { name: true, logo: true } },
          items: {
            include: {
              product: { select: { name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.transaction.findMany({
        where: { 
          userId,
          createdAt: { gt: sinceDate }
        },
        orderBy: { createdAt: 'desc' }
      }),
      
      prisma.user.findUnique({
        where: { id: userId },
        select: { balance: true, updatedAt: true }
      })
    ])

    const hasUpdates = newOrders.length > 0 || newTransactions.length > 0

    return NextResponse.json({
      hasUpdates,
      lastUpdate: new Date().toISOString(),
      updates: hasUpdates ? {
        orders: newOrders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          service: order.items.length > 0 
            ? `${order.service.name} - ${order.items[0].product.name}`
            : order.service.name,
          amount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          serviceLogo: order.service.logo
        })),
        transactions: newTransactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          description: tx.description,
          createdAt: tx.createdAt.toISOString(),
          balanceBefore: tx.balanceBefore,
          balanceAfter: tx.balanceAfter
        })),
        balance: currentBalance?.balance || 0
      } : null
    })

  } catch (error) {
    console.error('Real-time dashboard update error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch updates' },
      { status: 500 }
    )
  }
}
