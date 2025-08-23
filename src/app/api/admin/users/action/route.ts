import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const userActionSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  action: z.enum(['activate', 'deactivate', 'promote', 'demote'], {
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
    const validation = userActionSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: validation.error.issues
      }, { status: 400 })
    }

    const { userId, action } = validation.data

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, { status: 404 })
    }

    // Prevent self-modification for certain actions
    if (userId === session.user.id) {
      if (action === 'deactivate' || action === 'demote') {
        return NextResponse.json({
          success: false,
          message: 'You cannot perform this action on yourself'
        }, { status: 400 })
      }
    }

    // Only SUPER_ADMIN can promote/demote other admins or modify SUPER_ADMIN accounts
    if (currentUser.role !== 'SUPER_ADMIN') {
      if (targetUser.role === 'SUPER_ADMIN' || 
          (action === 'promote' && targetUser.role === 'ADMIN') ||
          (action === 'demote' && targetUser.role === 'ADMIN')) {
        return NextResponse.json({
          success: false,
          message: 'Insufficient privileges. Super Admin access required.'
        }, { status: 403 })
      }
    }

    let updateData: Record<string, unknown> = {}
    let successMessage = ''

    switch (action) {
      case 'activate':
        if (targetUser.isActive) {
          return NextResponse.json({
            success: false,
            message: 'User is already active'
          }, { status: 400 })
        }
        updateData = { isActive: true }
        successMessage = 'User has been activated successfully'
        break

      case 'deactivate':
        if (!targetUser.isActive) {
          return NextResponse.json({
            success: false,
            message: 'User is already deactivated'
          }, { status: 400 })
        }
        updateData = { isActive: false }
        successMessage = 'User has been banned successfully'
        break

      case 'promote':
        if (targetUser.role === 'ADMIN') {
          return NextResponse.json({
            success: false,
            message: 'User is already an admin'
          }, { status: 400 })
        }
        if (targetUser.role === 'SUPER_ADMIN') {
          return NextResponse.json({
            success: false,
            message: 'User is already a super admin'
          }, { status: 400 })
        }
        updateData = { role: 'ADMIN' }
        successMessage = 'User has been promoted to admin successfully'
        break

      case 'demote':
        if (targetUser.role === 'USER') {
          return NextResponse.json({
            success: false,
            message: 'User is already a regular user'
          }, { status: 400 })
        }
        updateData = { role: 'USER' }
        successMessage = 'User has been demoted to regular user successfully'
        break

      default:
        return NextResponse.json({
          success: false,
          message: 'Invalid action'
        }, { status: 400 })
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true
      }
    })

    // Log the action (you might want to create an audit log table)
    console.log(`Admin ${currentUser.email} performed ${action} on user ${targetUser.email}`)

    return NextResponse.json({
      success: true,
      message: successMessage,
      data: {
        user: updatedUser
      }
    })

  } catch (error) {
    console.error('Error performing user action:', error)
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}
