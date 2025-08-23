import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, OrderStatus } from '@prisma/client'
import { vipResellerAPI } from '@/lib/vip-reseller'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { orderIds, syncAll = false } = body

    let ordersToSync: string[] = []

    if (syncAll) {
      // Get all orders that have externalId but are not completed/failed
      const orders = await prisma.order.findMany({
        where: {
          externalId: { not: null },
          status: {
            notIn: [OrderStatus.SUCCESS, OrderStatus.FAILED, OrderStatus.CANCELLED]
          }
        },
        select: { id: true }
      })
      ordersToSync = orders.map(order => order.id)
    } else if (orderIds && Array.isArray(orderIds) && orderIds.length > 0) {
      ordersToSync = orderIds
    } else {
      return NextResponse.json(
        { success: false, message: 'Order IDs are required or set syncAll to true' },
        { status: 400 }
      )
    }

    if (ordersToSync.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No orders found to sync' },
        { status: 400 }
      )
    }

    const syncResults = []
    let successCount = 0
    let failureCount = 0

    // Process orders in batches to avoid rate limits
    for (const orderId of ordersToSync) {
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: {
            id: true,
            externalId: true,
            status: true,
            orderNumber: true
          }
        })

        if (!order || !order.externalId) {
          syncResults.push({
            orderId,
            success: false,
            error: 'Order not found or missing external ID'
          })
          failureCount++
          continue
        }

        // Check status from VIP Reseller
        const statusResponse = await vipResellerAPI.getOrderStatus(order.externalId)
        
        if (statusResponse.result && statusResponse.data) {
          const vipStatus = statusResponse.data.status
          let newStatus: OrderStatus = order.status

          // Map VIP status to our order status
          switch (vipStatus.toLowerCase()) {
            case 'success':
            case 'completed':
            case 'sukses':
              newStatus = OrderStatus.SUCCESS
              break
            case 'failed':
            case 'gagal':
              newStatus = OrderStatus.FAILED
              break
            case 'pending':
            case 'process':
            case 'processing':
              newStatus = OrderStatus.PROCESSING
              break
            case 'cancelled':
            case 'cancel':
              newStatus = OrderStatus.CANCELLED
              break
          }

          // Update order if status changed
          if (newStatus !== order.status) {
            const updateData: Record<string, unknown> = {
              status: newStatus,
              updatedAt: new Date()
            }
            
            if (statusResponse.data.note) {
              updateData.notes = `VIP Status: ${statusResponse.data.note}`
            }

            await prisma.order.update({
              where: { id: orderId },
              data: updateData
            })

            syncResults.push({
              orderId,
              success: true,
              oldStatus: order.status,
              newStatus,
              vipStatus,
              message: statusResponse.data.note || 'Status updated successfully'
            })
            successCount++
          } else {
            syncResults.push({
              orderId,
              success: true,
              status: order.status,
              message: 'Status already up to date'
            })
            successCount++
          }
        } else {
          syncResults.push({
            orderId,
            success: false,
            error: statusResponse.message || 'Failed to check VIP order status'
          })
          failureCount++
        }

        // Add small delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Sync error for order ${orderId}:`, error)
        syncResults.push({
          orderId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown sync error'
        })
        failureCount++
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed. ${successCount} successful, ${failureCount} failed.`,
      data: {
        totalProcessed: ordersToSync.length,
        successCount,
        failureCount,
        results: syncResults
      }
    })
  } catch (error) {
    console.error('Orders sync error:', error)
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
