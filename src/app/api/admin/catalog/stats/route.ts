import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get total services count
    const totalServices = await prisma.service.count()

    // Get total products count
    const totalProducts = await prisma.product.count()

    // Get total stock (only for limited products)
    const totalStock = await prisma.product.aggregate({
      where: {
        stockType: 'LIMITED',
        stock: {
          not: null
        }
      },
      _sum: {
        stock: true
      }
    })

    // Get last sync time from webhook logs or product updates
    const lastSync = await prisma.product.findFirst({
      where: {
        lastStockSync: {
          not: null
        }
      },
      orderBy: {
        lastStockSync: 'desc'
      },
      select: {
        lastStockSync: true
      }
    }).catch(() => null)

    // Get pending sync count (this could be based on failed syncs or manual queue)
    const pendingSync = 0 // For now, set to 0 as we don't have a sync queue

    const stats = {
      totalServices,
      totalProducts,
      totalStock: totalStock._sum.stock || 0,
      lastSyncTime: lastSync?.lastStockSync?.toISOString() || null,
      pendingSync
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Catalog stats API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
