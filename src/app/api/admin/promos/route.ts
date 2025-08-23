import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET - Fetch all promos
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

    const promos = await prisma.promo.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: promos
    })
  } catch (error) {
    console.error('Promos fetch error:', error)
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

// POST - Create new promo
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

    // Check if promo code already exists
    const existingPromo = await prisma.promo.findUnique({
      where: { code: code.trim().toUpperCase() }
    })

    if (existingPromo) {
      return NextResponse.json(
        { success: false, message: 'Promo code already exists' },
        { status: 400 }
      )
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

    const promo = await prisma.promo.create({
      data: {
        code: code.trim().toUpperCase(),
        name: name.trim(),
        description: description?.trim() || null,
        type,
        value: parseFloat(value),
        minAmount: minAmount ? parseFloat(minAmount) : null,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        usedCount: 0,
        validFrom: new Date(validFrom),
        validTo: new Date(validTo),
        isActive: isActive ?? true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Promo created successfully',
      data: promo
    }, { status: 201 })
  } catch (error) {
    console.error('Create promo error:', error)
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
