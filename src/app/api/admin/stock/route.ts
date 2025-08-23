import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { vipSyncService } from '@/lib/services/vip-sync'
import { prisma } from '@/lib/prisma'
import { UserRole, StockType } from '@prisma/client'

export async function PUT(request: NextRequest) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Insufficient privileges' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { productId, stock, stockType, minStock, maxStock, reason } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Update product stock and settings
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: stock !== undefined ? stock : undefined,
        stockType: stockType || undefined,
        minStock: minStock !== undefined ? minStock : undefined,
        maxStock: maxStock !== undefined ? maxStock : undefined,
        updatedAt: new Date()
      }
    })

    // If stock is being updated, record the change
    if (stock !== undefined) {
      await vipSyncService.updateProductStock(
        productId, 
        stock, 
        reason || 'Manual admin adjustment',
        session.user.id
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Stock updated successfully',
      data: updatedProduct
    })
  } catch (error) {
    console.error('Stock update API error:', error)
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

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin privileges
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json(
        { success: false, message: 'Insufficient privileges' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const action = searchParams.get('action')

    if (action === 'history' && productId) {
      // Get stock history for a product
      const history = await prisma.stockHistory.findMany({
        where: { productId },
        orderBy: { createdAt: 'desc' },
        take: 50
      })

      return NextResponse.json({
        success: true,
        data: history
      })
    }

    if (action === 'products') {
      // Get all products with stock information
      const products = await prisma.product.findMany({
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
        },
        orderBy: { name: 'asc' }
      })

      return NextResponse.json({
        success: true,
        data: products
      })
    }

    if (action === 'low-stock') {
      const lowStockProducts = await vipSyncService.getLowStockProducts()
      return NextResponse.json({
        success: true,
        data: lowStockProducts
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action or missing parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Stock API error:', error)
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
