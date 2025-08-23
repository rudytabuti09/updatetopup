import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// GET - Fetch services with statistics
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

    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const categoryId = searchParams.get('categoryId')

    const whereClause: Record<string, unknown> = {}
    if (categoryId && categoryId !== 'all') {
      whereClause.categoryId = categoryId
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        ...(includeProducts && {
          products: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        }),
        _count: {
          select: {
            products: true,
            orders: true
          }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: {
        services,
        count: services.length
      }
    })
  } catch (error) {
    console.error('Services fetch error:', error)
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

// POST - Create new service
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
      categoryId, 
      name, 
      description, 
      logo, 
      provider,
      sortOrder = 0 
    } = body

    if (!categoryId || !name || !provider) {
      return NextResponse.json(
        { success: false, message: 'Category ID, name, and provider are required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 400 }
      )
    }

    // Generate slug from name
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if provider already exists
    const existing = await prisma.service.findFirst({
      where: {
        OR: [
          { provider },
          { slug }
        ]
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Service with this provider or slug already exists' },
        { status: 400 }
      )
    }

    const service = await prisma.service.create({
      data: {
        categoryId,
        name: name.trim(),
        slug,
        description: description?.trim(),
        logo,
        provider,
        sortOrder: parseInt(sortOrder),
        isActive: true
      },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Service created successfully',
      data: service
    })
  } catch (error) {
    console.error('Service creation error:', error)
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
