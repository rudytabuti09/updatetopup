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

    // Get today's date for new users calculation
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Calculate statistics
    const [
      totalUsers,
      activeUsers, 
      bannedUsers,
      adminUsers,
      totalBalance,
      newUsersToday
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Active users
      prisma.user.count({
        where: { isActive: true }
      }),
      
      // Banned users
      prisma.user.count({
        where: { isActive: false }
      }),
      
      // Admin users (both ADMIN and SUPER_ADMIN)
      prisma.user.count({
        where: {
          role: {
            in: ['ADMIN', 'SUPER_ADMIN']
          }
        }
      }),
      
      // Total balance across all users
      prisma.user.aggregate({
        _sum: {
          balance: true
        }
      }),
      
      // New users today
      prisma.user.count({
        where: {
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ])

    const stats = {
      totalUsers,
      activeUsers,
      bannedUsers,
      adminUsers,
      totalBalance: totalBalance._sum.balance || 0,
      newUsersToday
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Error fetching user statistics:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
