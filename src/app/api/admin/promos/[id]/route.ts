import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET - Get specific promo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const promo = await prisma.promo.findUnique({
      where: { id }
    })

    if (!promo) {
      return NextResponse.json(
        { success: false, message: 'Promo not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: promo
    })
  } catch (error) {
    console.error('Get promo error:', error)
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

// PUT - Update promo
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()
    const {
      code,
      name,
      description,
      type,
      value,
      minAmount,
      maxDiscount,
      usageLimit,
      validFrom,
      validTo,
      isActive
    } = body

    // Check if promo exists
    const existingPromo = await prisma.promo.findUnique({
      where: { id }
    })

    if (!existingPromo) {
      return NextResponse.json(
        { success: false, message: 'Promo not found' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!code?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Promo code is required' },
        { status: 400 }
      )
    }

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Promo name is required' },
        { status: 400 }
      )
    }

    if (!type || !['PERCENTAGE', 'FIXED'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid promo type' },
        { status: 400 }
      )
    }

    if (!value || value <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid discount value is required' },
        { status: 400 }
      )
    }

    if (!validFrom || !validTo) {
      return NextResponse.json(
        { success: false, message: 'Valid date range is required' },
        { status: 400 }
      )
    }

    // Check if code is being changed and if new code already exists
    if (code.trim().toUpperCase() !== existingPromo.code) {
      const codeExists = await prisma.promo.findFirst({
        where: {
          code: code.trim().toUpperCase(),
          id: { not: id }
        }
      })

      if (codeExists) {
        return NextResponse.json(
          { success: false, message: 'Promo code already exists' },
          { status: 400 }
        )
      }
    }

    // Validate percentage discount
    if (type === 'PERCENTAGE' && (value < 0 || value > 100)) {
      return NextResponse.json(
        { success: false, message: 'Percentage discount must be between 0-100' },
        { status: 400 }
      )
    }

    // Validate date range
    const fromDate = new Date(validFrom)
    const toDate = new Date(validTo)
    
    if (toDate <= fromDate) {
      return NextResponse.json(
        { success: false, message: 'End date must be after start date' },
        { status: 400 }
      )
    }

    const updatedPromo = await prisma.promo.update({
      where: { id },
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description?.trim() || null,
        type,
        value: parseFloat(value),
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        isActive: isActive ?? existingPromo.isActive
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Promo updated successfully',
      data: updatedPromo
    })
  } catch (error) {
    console.error('Update promo error:', error)
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

// DELETE - Delete promo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Only super admin can delete promos' },
        { status: 403 }
      )
    }

    const { id } = await params

    // Check if promo exists
    const promo = await prisma.promo.findUnique({
      where: { id }
    })

    if (!promo) {
      return NextResponse.json(
        { success: false, message: 'Promo not found' },
        { status: 404 }
      )
    }

    // Check if promo has been used
    if (promo.usedCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete promo that has been used' },
        { status: 400 }
      )
    }

    await prisma.promo.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Promo deleted successfully'
    })
  } catch (error) {
    console.error('Delete promo error:', error)
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
