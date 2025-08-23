/**
 * VIP Reseller Status Synchronization Service
 * 
 * This service handles periodic checking and updating of order statuses
 * from VIP Reseller API to ensure local orders are up-to-date.
 */

import { vipResellerAPI } from '@/lib/vip-reseller'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export interface StatusSyncResult {
  processed: number
  updated: number
  failed: number
  errors: Array<{ orderId: string, error: string }>
}

export class VipStatusSyncService {
  
  /**
   * Sync status for all pending orders (PROCESSING state)
   */
  async syncAllPendingOrders(): Promise<StatusSyncResult> {
    const result: StatusSyncResult = {
      processed: 0,
      updated: 0,
      failed: 0,
      errors: []
    }

    try {
      // Get all orders with PROCESSING status that have external ID
      const pendingOrders = await prisma.order.findMany({
        where: {
          status: OrderStatus.PROCESSING,
          externalId: { not: null }
        },
        include: {
          service: true,
          items: {
            include: {
              product: true
            }
          }
        }
      })

      console.log(`Found ${pendingOrders.length} pending orders to sync`)

      for (const order of pendingOrders) {
        result.processed++
        
        try {
          await this.syncOrderStatus(order.id, order.externalId!)
          result.updated++
        } catch (error) {
          result.failed++
          result.errors.push({
            orderId: order.orderNumber,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          console.error(`Failed to sync order ${order.orderNumber}:`, error)
        }

        // Add small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      }

      console.log(`Status sync completed: ${result.updated}/${result.processed} orders updated`)
      return result

    } catch (error) {
      console.error('Status sync failed:', error)
      throw error
    }
  }

  /**
   * Sync status for a specific order by internal ID
   */
  async syncOrderStatus(orderId: string, externalId: string): Promise<void> {
    try {
      // Get current status from VIP Reseller
      const statusResponse = await vipResellerAPI.getOrderStatus(externalId)
      
      if (!statusResponse.result) {
        throw new Error(`VIP API error: ${statusResponse.message}`)
      }

      // Map VIP status to our order status
      const newStatus = this.mapVipStatusToOrderStatus(statusResponse.data.status)
      
      // Get current order
      const currentOrder = await prisma.order.findUnique({
        where: { id: orderId }
      })

      if (!currentOrder) {
        throw new Error('Order not found')
      }

      // Only update if status has changed
      if (currentOrder.status !== newStatus) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: newStatus,
            notes: statusResponse.data.note || statusResponse.data.sn,
            updatedAt: new Date()
          }
        })

        // Log status change
        await this.logStatusChange(orderId, currentOrder.status, newStatus, statusResponse.data)
        
        console.log(`Order ${currentOrder.orderNumber} status updated: ${currentOrder.status} → ${newStatus}`)
      }

    } catch (error) {
      console.error(`Failed to sync order ${orderId}:`, error)
      throw error
    }
  }

  /**
   * Sync status by order number (for API calls)
   */
  async syncOrderByNumber(orderNumber: string): Promise<void> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      select: { id: true, externalId: true }
    })

    if (!order) {
      throw new Error('Order not found')
    }

    if (!order.externalId) {
      throw new Error('Order has no external ID')
    }

    await this.syncOrderStatus(order.id, order.externalId)
  }

  /**
   * Map VIP Reseller status to our OrderStatus enum
   */
  private mapVipStatusToOrderStatus(vipStatus: string): OrderStatus {
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
        
      case 'refunded':
        return OrderStatus.REFUNDED
        
      case 'pending':
      case 'processing':
      default:
        return OrderStatus.PROCESSING
    }
  }

  /**
   * Log status changes for audit trail
   */
  private async logStatusChange(
    orderId: string, 
    oldStatus: OrderStatus, 
    newStatus: OrderStatus, 
    vipData: Record<string, unknown>
  ): Promise<void> {
    try {
      await prisma.webhook.create({
        data: {
          orderId,
          type: 'ORDER_STATUS_UPDATE',
          source: 'vip-reseller-sync',
          payload: JSON.parse(JSON.stringify({
            oldStatus,
            newStatus,
            vipData,
            syncedAt: new Date().toISOString()
          })),
          processed: true
        }
      })
    } catch (error) {
      console.error('Failed to log status change:', error)
      // Don't throw here, as this is just for logging
    }
  }

  /**
   * Cleanup old webhook logs (keep only last 30 days)
   */
  async cleanupOldWebhookLogs(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const result = await prisma.webhook.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo }
      }
    })

    console.log(`Cleaned up ${result.count} old webhook logs`)
    return result.count
  }

  /**
   * Get sync statistics
   */
  async getSyncStats(): Promise<{
    pendingOrders: number
    lastSyncTime: Date | null
    recentErrors: number
  }> {
    const [pendingCount, lastWebhook, errorCount] = await Promise.all([
      prisma.order.count({
        where: {
          status: OrderStatus.PROCESSING,
          externalId: { not: null }
        }
      }),
      prisma.webhook.findFirst({
        where: {
          type: 'ORDER_STATUS_UPDATE',
          source: 'vip-reseller-sync'
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
      }),
      prisma.webhook.count({
        where: {
          type: 'ORDER_STATUS_UPDATE',
          source: 'vip-reseller-sync',
          processed: false,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      })
    ])

    return {
      pendingOrders: pendingCount,
      lastSyncTime: lastWebhook?.createdAt || null,
      recentErrors: errorCount
    }
  }
}

// Export singleton instance
export const vipStatusSyncService = new VipStatusSyncService()
