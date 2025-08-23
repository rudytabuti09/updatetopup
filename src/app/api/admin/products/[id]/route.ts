import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

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
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            category: true
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Get product error:', error)
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
      name, 
      description, 
      serviceId, 
      sku,
      buyPrice,
      price,
      isActive,
      sortOrder
    } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Product name is required' },
        { status: 400 }
      )
    }

    if (!serviceId?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Service is required' },
        { status: 400 }
      )
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
      return NextResponse.json(
        { success: false, message: 'Invalid price' },
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

    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 400 }
      )
    }

    // Check if name already exists for another product in the same service
    const nameExists = await prisma.product.findFirst({
      where: {
        name: name.trim(),
        serviceId,
        id: { not: id }
      }
    })

    if (nameExists) {
      return NextResponse.json(
        { success: false, message: 'Product name already exists in this service' },
        { status: 400 }
      )
    }

    // Calculate profit if both prices are provided
    let calculatedProfit = existingProduct.profit
    if (price !== undefined && buyPrice !== undefined) {
      calculatedProfit = price - buyPrice
    } else if (price !== undefined) {
      calculatedProfit = price - existingProduct.buyPrice
    } else if (buyPrice !== undefined) {
      calculatedProfit = existingProduct.price - buyPrice
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        serviceId,
        sku: sku?.trim() || existingProduct.sku,
        buyPrice: buyPrice !== undefined ? buyPrice : existingProduct.buyPrice,
        price: price !== undefined ? price : existingProduct.price,
        profit: calculatedProfit,
        isActive: isActive ?? existingProduct.isActive,
        sortOrder: sortOrder ?? existingProduct.sortOrder
      },
      include: {
        service: {
          include: {
            category: true
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    console.error('Update product error:', error)
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
        { success: false, message: 'Only super admin can delete products' },
        { status: 403 }
      )
    }

    const { id } = await params
    // Check if product exists and has orders
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product has orders
    if (product._count.orders > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete product with existing orders' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Delete product error:', error)
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
