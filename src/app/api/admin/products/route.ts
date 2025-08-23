import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole, StockType } from '@prisma/client'

// GET - Fetch products with filters
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
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const categoryId = searchParams.get('categoryId') || ''
    const serviceId = searchParams.get('serviceId') || ''
    const stockType = searchParams.get('stockType') || ''
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    // Build where clause
    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (serviceId) {
      where.serviceId = serviceId
    }

    if (stockType && Object.values(StockType).includes(stockType as StockType)) {
      where.stockType = stockType
    }

    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    if (categoryId) {
      where.service = {
        categoryId: categoryId
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          service: {
            include: {
              category: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
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
      stockType = StockType.UNLIMITED,
      stock,
      minStock,
      maxStock,
      isActive = true,
      sortOrder = 0
    } = body

    // Validation
    if (!serviceId || !name || !price || !buyPrice || !sku) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku }
    })

    if (existingSku) {
      return NextResponse.json(
        { success: false, message: 'SKU already exists' },
        { status: 400 }
      )
    }

    // Calculate profit
    const profit = price - buyPrice

    // Create product
    const product = await prisma.product.create({
      data: {
        serviceId,
        name: name.trim(),
        description: description?.trim(),
        price: parseFloat(price),
        buyPrice: parseFloat(buyPrice),
        profit,
        sku: sku.trim(),
        category: category || service.name,
        stockType,
        stock: stockType === StockType.LIMITED ? (stock ? parseInt(stock) : 0) : null,
        minStock: minStock ? parseInt(minStock) : null,
        maxStock: maxStock ? parseInt(maxStock) : null,
        isActive,
        sortOrder: parseInt(sortOrder)
      },
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: product
    })
  } catch (error) {
    console.error('Product creation error:', error)
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

// PUT - Update product
export async function PUT(request: NextRequest) {
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // If SKU is being updated, check for conflicts
    if (updateData.sku && updateData.sku !== existingProduct.sku) {
      const skuConflict = await prisma.product.findFirst({
        where: {
          sku: updateData.sku,
          id: { not: id }
        }
      })

      if (skuConflict) {
        return NextResponse.json(
          { success: false, message: 'SKU already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const dataToUpdate: Record<string, unknown> = {}
    
    if (updateData.name !== undefined) dataToUpdate.name = updateData.name.trim()
    if (updateData.description !== undefined) dataToUpdate.description = updateData.description?.trim()
    if (updateData.price !== undefined) dataToUpdate.price = parseFloat(updateData.price)
    if (updateData.buyPrice !== undefined) dataToUpdate.buyPrice = parseFloat(updateData.buyPrice)
    if (updateData.sku !== undefined) dataToUpdate.sku = updateData.sku.trim()
    if (updateData.category !== undefined) dataToUpdate.category = updateData.category
    if (updateData.stockType !== undefined) dataToUpdate.stockType = updateData.stockType
    if (updateData.isActive !== undefined) dataToUpdate.isActive = updateData.isActive
    if (updateData.sortOrder !== undefined) dataToUpdate.sortOrder = parseInt(updateData.sortOrder)
    
    // Handle stock-related fields
    if (updateData.stockType === StockType.LIMITED) {
      if (updateData.stock !== undefined) dataToUpdate.stock = parseInt(updateData.stock)
      if (updateData.minStock !== undefined) dataToUpdate.minStock = updateData.minStock ? parseInt(updateData.minStock) : null
      if (updateData.maxStock !== undefined) dataToUpdate.maxStock = updateData.maxStock ? parseInt(updateData.maxStock) : null
    } else if (updateData.stockType === StockType.UNLIMITED) {
      dataToUpdate.stock = null
    }

    // Calculate profit if price or buyPrice changed
    if (dataToUpdate.price !== undefined || dataToUpdate.buyPrice !== undefined) {
      const newPrice = (dataToUpdate.price as number) ?? existingProduct.price
      const newBuyPrice = (dataToUpdate.buyPrice as number) ?? existingProduct.buyPrice
      dataToUpdate.profit = newPrice - newBuyPrice
    }

    dataToUpdate.updatedAt = new Date()

    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: dataToUpdate,
      include: {
        service: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    })
  } catch (error) {
    console.error('Product update error:', error)
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

// DELETE - Delete product
export async function DELETE(request: NextRequest) {
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
        { success: false, message: 'Only Super Admin can delete products' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product has orders
    const hasOrders = await prisma.orderItem.findFirst({
      where: { productId: id }
    })

    if (hasOrders) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete product with existing orders. Consider deactivating instead.' },
        { status: 400 }
      )
    }

    // Delete product
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Product deletion error:', error)
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
