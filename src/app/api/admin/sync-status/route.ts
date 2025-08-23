import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vipStatusSyncService } from '@/lib/services/vip-status-sync'

// Manual sync endpoint (requires admin auth)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is admin (for manual sync)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'sync'
    const orderNumber = searchParams.get('orderNumber')

    switch (action) {
      case 'sync-all':
        // Sync all pending orders
        const syncResult = await vipStatusSyncService.syncAllPendingOrders()
        return NextResponse.json({
          success: true,
          message: `Sync completed: ${syncResult.updated}/${syncResult.processed} orders updated`,
          data: syncResult
        })

      case 'sync-order':
        // Sync specific order
        if (!orderNumber) {
          return NextResponse.json(
            { success: false, message: 'Order number required for sync-order action' },
            { status: 400 }
          )
        }
        
        await vipStatusSyncService.syncOrderByNumber(orderNumber)
        return NextResponse.json({
          success: true,
          message: `Order ${orderNumber} status synchronized`
        })

      case 'cleanup':
        // Cleanup old webhook logs
        const cleanedCount = await vipStatusSyncService.cleanupOldWebhookLogs()
        return NextResponse.json({
          success: true,
          message: `Cleaned up ${cleanedCount} old webhook logs`
        })

      case 'stats':
        // Get sync statistics
        const stats = await vipStatusSyncService.getSyncStats()
        return NextResponse.json({
          success: true,
          data: stats
        })

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action. Use: sync-all, sync-order, cleanup, or stats' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Status sync API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Status sync failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Cron job endpoint (no auth required for scheduled tasks)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cronKey = searchParams.get('key')
    const expectedCronKey = process.env.CRON_SECRET_KEY

    // Verify cron secret key for automated calls
    if (!cronKey || !expectedCronKey || cronKey !== expectedCronKey) {
      return NextResponse.json(
        { success: false, message: 'Invalid cron key' },
        { status: 401 }
      )
    }

    // Run automated sync
    const syncResult = await vipStatusSyncService.syncAllPendingOrders()
    
    // Cleanup old logs if it's been more than 24 hours
    const stats = await vipStatusSyncService.getSyncStats()
    const shouldCleanup = !stats.lastSyncTime || 
      (Date.now() - stats.lastSyncTime.getTime()) > 24 * 60 * 60 * 1000

    let cleanupCount = 0
    if (shouldCleanup) {
      cleanupCount = await vipStatusSyncService.cleanupOldWebhookLogs()
    }

    return NextResponse.json({
      success: true,
      message: 'Automated sync completed',
      data: {
        ...syncResult,
        cleanupCount,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Automated status sync error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Automated sync failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
