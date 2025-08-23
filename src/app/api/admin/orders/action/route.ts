import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const orderActionSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  action: z.enum(['process', 'complete', 'fail', 'refund'], {
    message: 'Action is required'
  })
})

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    
    // Validate request body
    const validation = orderActionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.issues
      }, { status: 400 })
    }

    const { orderId, action } = validation.data

    // Get target order
    const targetOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            balance: true
          }
        },
        payment: {
          select: {
            status: true,
            amount: true
          }
        }
      }
    })

    if (!targetOrder) {
      return NextResponse.json({
        success: false,
        message: 'Order not found'
      }, { status: 404 })
    }

    let updateData: Record<string, unknown> = {}
    let successMessage = ''
    let shouldUpdateUserBalance = false
    let balanceChange = 0

    switch (action) {
      case 'process':
        if (targetOrder.status !== 'PENDING') {
          return NextResponse.json({
            success: false,
            message: 'Order must be in PENDING status to process'
          }, { status: 400 })
        }
        updateData = { status: 'PROCESSING' }
        successMessage = 'Order is now being processed'
        break

      case 'complete':
        if (targetOrder.status !== 'PROCESSING') {
          return NextResponse.json({
            success: false,
            message: 'Order must be in PROCESSING status to complete'
          }, { status: 400 })
        }
        updateData = { status: 'SUCCESS' }
        successMessage = 'Order has been completed successfully'
        break

      case 'fail':
        if (targetOrder.status !== 'PROCESSING') {
          return NextResponse.json({
            success: false,
            message: 'Order must be in PROCESSING status to fail'
          }, { status: 400 })
        }
        updateData = { status: 'FAILED' }
        successMessage = 'Order has been marked as failed'
        
        // If payment was made, refund the user
        if (targetOrder.payment?.status === 'SETTLEMENT') {
          shouldUpdateUserBalance = true
          balanceChange = targetOrder.totalAmount
        }
        break

      case 'refund':
        if (targetOrder.status !== 'SUCCESS' && targetOrder.status !== 'FAILED') {
          return NextResponse.json({
            success: false,
            message: 'Order must be completed or failed to refund'
          }, { status: 400 })
        }
        if (targetOrder.payment?.status !== 'SETTLEMENT') {
          return NextResponse.json({
            success: false,
            message: 'Order payment must be settled to refund'
          }, { status: 400 })
        }
        updateData = { 
          status: 'REFUNDED'
        }
        successMessage = 'Order has been refunded successfully'
        shouldUpdateUserBalance = true
        balanceChange = targetOrder.totalAmount
        
        // Also update payment status
        await prisma.payment.update({
          where: { orderId: targetOrder.id },
          data: { status: 'CANCELLED' }
        })
        break

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 })
    }

    // Use transaction to update order and user balance if needed
    const result = await prisma.$transaction(async (tx) => {
      // Update order
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: updateData,
        select: {
          id: true,
          orderNumber: true,
          status: true,
          totalAmount: true
        }
      })

      // Update user balance if needed (for refunds)
      if (shouldUpdateUserBalance && balanceChange > 0 && targetOrder.userId) {
        const user = await tx.user.findUnique({
          where: { id: targetOrder.userId }
        })
        
        if (user) {
          const newBalance = user.balance + balanceChange
          
          await tx.user.update({
            where: { id: targetOrder.userId },
            data: {
              balance: newBalance
            }
          })

          // Create transaction record for refund
          await tx.transaction.create({
            data: {
              userId: targetOrder.userId,
              type: 'REFUND',
              amount: balanceChange,
              description: `Refund for order ${targetOrder.orderNumber}`,
              reference: targetOrder.orderNumber,
              balanceBefore: user.balance,
              balanceAfter: newBalance
            }
          })
        }
      }

      return updatedOrder
    })

    // Log the action
    console.log(`Admin ${currentUser.email} performed ${action} on order ${targetOrder.orderNumber}`)

    return NextResponse.json({
      success: true,
      message: successMessage,
      data: {
        order: result
      }
    })

  } catch (error) {
    console.error('Error performing order action:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
