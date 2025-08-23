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
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        category: true,
        products: {
          include: {
            _count: {
              select: { orders: true }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: service
    })
  } catch (error) {
    console.error('Get service error:', error)
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
      categoryId, 
      provider,
      logo,
      isActive,
      sortOrder
    } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Service name is required' },
        { status: 400 }
      )
    }

    if (!categoryId?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Category is required' },
        { status: 400 }
      )
    }

    // Check if service exists
    const existingService = await prisma.service.findUnique({
      where: { id }
    })

    if (!existingService) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 400 }
      )
    }

    // Check if name already exists for another service
    const nameExists = await prisma.service.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    })

    if (nameExists) {
      return NextResponse.json(
        { success: false, message: 'Service name already exists' },
        { status: 400 }
      )
    }

    // Check if provider exists for another service if provider is being updated
    if (provider && provider.trim() !== existingService.provider) {
      const providerExists = await prisma.service.findFirst({
        where: {
          provider: provider.trim(),
          id: { not: id }
        }
      })

      if (providerExists) {
        return NextResponse.json(
          { success: false, message: 'Provider code already exists' },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, unknown> = {
      name: name.trim(),
      description: description?.trim() || null,
      categoryId,
      isActive: isActive ?? existingService.isActive,
      sortOrder: sortOrder ?? existingService.sortOrder
    }

    if (provider && provider.trim()) {
      updateData.provider = provider.trim()
    }
    
    if (logo !== undefined) {
      updateData.logo = logo?.trim() || null
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Service updated successfully',
      data: updatedService
    })
  } catch (error) {
    console.error('Update service error:', error)
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
        { success: false, message: 'Only super admin can delete services' },
        { status: 403 }
      )
    }

    const { id } = await params
    // Check if service exists
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        { success: false, message: 'Service not found' },
        { status: 404 }
      )
    }

    // Check if service has products
    if (service._count.products > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete service with existing products' },
        { status: 400 }
      )
    }

    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Service deleted successfully'
    })
  } catch (error) {
    console.error('Delete service error:', error)
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
