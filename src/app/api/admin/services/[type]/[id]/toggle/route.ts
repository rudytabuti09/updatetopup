import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
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

    const { type, id } = await params

    if (!['category', 'service', 'product'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be category, service, or product' },
        { status: 400 }
      )
    }

    let result
    let message = ''

    switch (type) {
      case 'category':
        // Get current category status
        const category = await prisma.category.findUnique({
          where: { id }
        })
        
        if (!category) {
          return NextResponse.json(
            { success: false, message: 'Category not found' },
            { status: 404 }
          )
        }

        // Toggle status
        result = await prisma.category.update({
          where: { id },
          data: { isActive: !category.isActive }
        })
        
        message = `Category ${result.isActive ? 'activated' : 'deactivated'} successfully`
        break

      case 'service':
        // Get current service status
        const service = await prisma.service.findUnique({
          where: { id }
        })
        
        if (!service) {
          return NextResponse.json(
            { success: false, message: 'Service not found' },
            { status: 404 }
          )
        }

        // Toggle status
        result = await prisma.service.update({
          where: { id },
          data: { isActive: !service.isActive }
        })
        
        message = `Service ${result.isActive ? 'activated' : 'deactivated'} successfully`
        break

      case 'product':
        // Get current product status
        const product = await prisma.product.findUnique({
          where: { id }
        })
        
        if (!product) {
          return NextResponse.json(
            { success: false, message: 'Product not found' },
            { status: 404 }
          )
        }

        // Toggle status
        result = await prisma.product.update({
          where: { id },
          data: { isActive: !product.isActive }
        })
        
        message = `Product ${result.isActive ? 'activated' : 'deactivated'} successfully`
        break

      default:
        return NextResponse.json(
          { success: false, message: 'Invalid type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message,
      data: result
    })
  } catch (error) {
    console.error(`Toggle status error:`, error)
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
