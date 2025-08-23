import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

// GET - Fetch products with filtering and pagination
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const serviceId = searchParams.get('serviceId')
    const categoryId = searchParams.get('categoryId')
    const isActive = searchParams.get('isActive')
    const search = searchParams.get('search')

    // Build where clause
    const whereClause: Record<string, unknown> = {}

    if (serviceId && serviceId !== 'all') {
      whereClause.serviceId = serviceId
    }

    if (categoryId && categoryId !== 'all') {
      whereClause.service = {
        categoryId
      }
    }

    if (isActive !== null && isActive !== 'all') {
      whereClause.isActive = isActive === 'true'
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { service: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where: whereClause })
    ])

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
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

// POST - Create new product
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
      serviceId,
      name,
      description,
      price,
      buyPrice,
      sku,
      category,
      stock,
      stockType = 'UNLIMITED',
      sortOrder = 0
    } = body

    if (!serviceId || !name || !price || !buyPrice || !sku) {
      return NextResponse.json(
        { success: false, message: 'Service ID, name, price, buy price, and SKU are required' },
        { status: 400 }
      )
    }

    // Check if service exists
    const serviceExists = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!serviceExists) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const skuExists = await prisma.product.findUnique({
      where: { sku }
    })

    if (skuExists) {
      return NextResponse.json(
        { success: false, message: 'Product with this SKU already exists' },
        { status: 400 }
      )
    }

    const priceNum = parseFloat(price)
    const buyPriceNum = parseFloat(buyPrice)
    const profit = priceNum - buyPriceNum

    const product = await prisma.product.create({
      data: {
        serviceId,
        name: name.trim(),
        description: description?.trim(),
        price: priceNum,
        buyPrice: buyPriceNum,
        profit,
        sku: sku.trim(),
        category: category || serviceExists.name,
        stock: stockType === 'LIMITED' ? parseInt(stock) || 0 : null,
        stockType,
        sortOrder: parseInt(sortOrder),
        isActive: true
      },
      include: {
        service: {
          select: {
            name: true,
            category: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    }, { status: 201 })
  } catch (error) {
    console.error('Create product error:', error)
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

export async function PATCH(request: NextRequest) {
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
    const { action, productIds, data } = body

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid bulk operation request' },
        { status: 400 }
      )
    }

    let result
    let message = ''

    switch (action) {
      case 'toggle_status':
        // Get current status for all products
        const products = await prisma.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, isActive: true }
        })

        // Toggle each product's status
        const togglePromises = products.map(product => 
          prisma.product.update({
            where: { id: product.id },
            data: { isActive: !product.isActive }
          })
        )

        result = await Promise.all(togglePromises)
        message = `${result.length} products status toggled successfully`
        break

      case 'update_prices':
        if (!data?.margin && !data?.sellingPrice) {
          return NextResponse.json(
            { success: false, message: 'Margin or selling price is required for bulk price update' },
            { status: 400 }
          )
        }

        const updateData: Record<string, unknown> = {}
        if (data.margin !== undefined) {
          updateData.margin = new Decimal(data.margin)
        }
        if (data.sellingPrice !== undefined) {
          updateData.sellingPrice = new Decimal(data.sellingPrice)
        }

        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: updateData
        })

        message = `${result.count} products prices updated successfully`
        break

      case 'activate':
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: true }
        })
        message = `${result.count} products activated successfully`
        break

      case 'deactivate':
        result = await prisma.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: false }
        })
        message = `${result.count} products deactivated successfully`
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid bulk action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message,
      data: result
    })
  } catch (error) {
    console.error('Bulk products operation error:', error)
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
