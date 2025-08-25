import { prisma } from '../prisma'
import { vipResellerAPI, VipService, VipProduct } from '../vip-reseller'
import { StockType, StockHistoryType } from '@prisma/client'

export interface SyncResult {
  success: boolean
  message: string
  data?: {
    servicesAdded: number
    servicesUpdated: number
    productsAdded: number
    productsUpdated: number
    stockUpdated: number
  }
  error?: string
}

export class VipSyncService {
  
  // Sync services from all VIP-Reseller APIs
  async syncServices(): Promise<SyncResult> {
    try {
      let servicesAdded = 0
      let servicesUpdated = 0
      const errors: string[] = []

      // Sync Game Feature services
      try {
        const gameServices = await vipResellerAPI.getServices()
        const { added: gameAdded, updated: gameUpdated } = await this.syncServicesFromList(
          gameServices, 
          'GAME_FEATURE'
        )
        servicesAdded += gameAdded
        servicesUpdated += gameUpdated
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.warn('Failed to sync game feature services:', errorMsg)
        errors.push(`Game services: ${errorMsg}`)
      }

      // Sync Prepaid services
      try {
        const prepaidServices = await vipResellerAPI.getPrepaidServices()
        const { added: prepaidAdded, updated: prepaidUpdated } = await this.syncServicesFromList(
          prepaidServices, 
          'PREPAID'
        )
        servicesAdded += prepaidAdded
        servicesUpdated += prepaidUpdated
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.warn('Failed to sync prepaid services:', errorMsg)
        errors.push(`Prepaid services: ${errorMsg}`)
      }

      // Sync Social Media services
      try {
        const socialServices = await vipResellerAPI.getSocialMediaServices()
        const { added: socialAdded, updated: socialUpdated } = await this.syncServicesFromList(
          socialServices, 
          'SOCIAL_MEDIA'
        )
        servicesAdded += socialAdded
        servicesUpdated += socialUpdated
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        console.warn('Failed to sync social media services:', errorMsg)
        errors.push(`Social media services: ${errorMsg}`)
      }

      // If all sync attempts failed, consider it a failure
      if (errors.length === 3) {
        return {
          success: false,
          message: 'All service sync attempts failed - VIP-Reseller API may be temporarily unavailable',
          error: errors.join('; ')
        }
      }

      // If some succeeded, consider it a partial success
      const message = errors.length > 0
        ? `Services sync completed with warnings: ${servicesAdded} added, ${servicesUpdated} updated. Issues: ${errors.join('; ')}`
        : `Services sync completed: ${servicesAdded} added, ${servicesUpdated} updated`

      return {
        success: true,
        message,
        data: {
          servicesAdded,
          servicesUpdated,
          productsAdded: 0,
          productsUpdated: 0,
          stockUpdated: 0
        },
        error: errors.length > 0 ? errors.join('; ') : undefined
      }
    } catch (error) {
      console.error('Services sync error:', error)
      return {
        success: false,
        message: 'Failed to sync services',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Helper method to sync services from a list
  private async syncServicesFromList(
    vipServices: VipService[], 
    serviceType: 'GAME_FEATURE' | 'PREPAID' | 'SOCIAL_MEDIA'
  ): Promise<{ added: number, updated: number }> {
    let servicesAdded = 0
    let servicesUpdated = 0

    for (const vipService of vipServices) {
      // Check if category exists, create if not
      let category = await prisma.category.findUnique({
        where: { slug: this.slugify(vipService.category) }
      })

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: vipService.category,
            slug: this.slugify(vipService.category),
            description: `${vipService.category} services`
          }
        })
      }

      // Check if service exists
      const existingService = await prisma.service.findFirst({
        where: { 
          provider: vipService.service
        }
      })

      if (existingService) {
        // Update existing service
        await prisma.service.update({
          where: { id: existingService.id },
          data: {
            name: vipService.name,
            isActive: vipService.status === 'active',
            updatedAt: new Date()
          }
        })
        servicesUpdated++
      } else {
        // Create new service
        await prisma.service.create({
          data: {
            categoryId: category.id,
            name: vipService.name,
            slug: this.slugify(vipService.name),
            provider: vipService.service, // VIP-Reseller service code goes in provider field
            isActive: vipService.status === 'active',
            description: vipService.note || undefined
          }
        })
        servicesAdded++
      }
    }

    return { added: servicesAdded, updated: servicesUpdated }
  }

  // Sync all products from VIP-Reseller
  async syncProducts(): Promise<SyncResult> {
    try {
      const vipProducts = await vipResellerAPI.getPriceList()
      let productsAdded = 0
      let productsUpdated = 0

      for (const vipProduct of vipProducts) {
        // Find the service for this product
        const service = await prisma.service.findUnique({
          where: { provider: vipProduct.service }
        })

        if (!service) {
          console.warn(`Service not found for product: ${vipProduct.service}`)
          continue
        }

        // Determine the price to use (basic, premium, or special)
        const price = vipProduct.price.basic || vipProduct.price.premium || vipProduct.price.special
        const buyPrice = price * 0.85 // Assume 85% is our cost, 15% profit

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { sku: vipProduct.service }
        })

        if (existingProduct) {
          // Update existing product
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              name: vipProduct.name,
              price: price,
              buyPrice: buyPrice,
              profit: price - buyPrice,
              isActive: vipProduct.status === 'available',
              updatedAt: new Date()
            }
          })
          productsUpdated++
        } else {
          // Create new product
          await prisma.product.create({
            data: {
              serviceId: service.id,
              name: vipProduct.name,
              sku: vipProduct.service,
              price: price,
              buyPrice: buyPrice,
              profit: price - buyPrice,
              category: service.name,
              isActive: vipProduct.status === 'available',
              stockType: StockType.UNLIMITED, // Default to unlimited
              description: `${vipProduct.name} - ${service.name}`
            }
          })
          productsAdded++
        }
      }

      return {
        success: true,
        message: `Products sync completed: ${productsAdded} added, ${productsUpdated} updated`,
        data: {
          servicesAdded: 0,
          servicesUpdated: 0,
          productsAdded,
          productsUpdated,
          stockUpdated: 0
        }
      }
    } catch (error) {
      console.error('Products sync error:', error)
      return {
        success: false,
        message: 'Failed to sync products',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Sync stock information from VIP-Reseller
  async syncStock(): Promise<SyncResult> {
    try {
      const stockResponse = await vipResellerAPI.getStock()
      
      if (!stockResponse.result) {
        return {
          success: false,
          message: 'Stock endpoint returned error - this feature may not be available for your account',
          error: stockResponse.message
        }
      }

      let stockUpdated = 0

      for (const stockItem of stockResponse.data) {
        const product = await prisma.product.findUnique({
          where: { sku: stockItem.service }
        })

        if (product) {
          const oldStock = product.stock
          const newStock = stockItem.stock
          
          // Update product stock
          await prisma.product.update({
            where: { id: product.id },
            data: {
              stock: newStock,
              stockType: newStock > 0 ? StockType.LIMITED : StockType.OUT_OF_STOCK,
              lastStockSync: new Date(),
              isActive: stockItem.status === 'available' && newStock > 0
            }
          })

          // Record stock history
          await prisma.stockHistory.create({
            data: {
              productId: product.id,
              type: StockHistoryType.SYNC_UPDATE,
              quantity: newStock - (oldStock || 0),
              oldStock: oldStock,
              newStock: newStock,
              reason: 'VIP-Reseller stock sync'
            }
          })

          stockUpdated++
        }
      }

      return {
        success: true,
        message: `Stock sync completed: ${stockUpdated} products updated`,
        data: {
          servicesAdded: 0,
          servicesUpdated: 0,
          productsAdded: 0,
          productsUpdated: 0,
          stockUpdated
        }
      }
    } catch (error) {
      console.error('Stock sync error:', error)
      return {
        success: false,
        message: 'Failed to sync stock',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Full sync: services, products, and stock
  async fullSync(): Promise<SyncResult> {
    try {
      const servicesResult = await this.syncServices()
      const productsResult = await this.syncProducts()
      
      // Try stock sync but don't fail the entire sync if it fails
      let stockResult: SyncResult
      try {
        stockResult = await this.syncStock()
      } catch (error) {
        console.warn('Stock sync failed, continuing without stock sync:', error)
        stockResult = {
          success: false,
          message: 'Stock sync failed - feature may not be available for your API account',
          error: error instanceof Error ? error.message : 'Unknown error',
          data: {
            servicesAdded: 0,
            servicesUpdated: 0,
            productsAdded: 0,
            productsUpdated: 0,
            stockUpdated: 0
          }
        }
      }

      const totalData = {
        servicesAdded: (servicesResult.data?.servicesAdded || 0),
        servicesUpdated: (servicesResult.data?.servicesUpdated || 0),
        productsAdded: (productsResult.data?.productsAdded || 0),
        productsUpdated: (productsResult.data?.productsUpdated || 0),
        stockUpdated: (stockResult.data?.stockUpdated || 0)
      }

      // Consider sync successful if services and products sync worked (stock is optional)
      const coreSuccess = servicesResult.success && productsResult.success
      const allSuccess = coreSuccess && stockResult.success
      
      const errors = [
        servicesResult.error,
        productsResult.error,
        !stockResult.success ? `Stock: ${stockResult.error || 'Failed'}` : null
      ].filter(Boolean)

      return {
        success: coreSuccess, // Success if core components (services & products) work
        message: allSuccess 
          ? `Full sync completed successfully: ${totalData.servicesAdded + totalData.productsAdded} items added, ${totalData.servicesUpdated + totalData.productsUpdated + totalData.stockUpdated} updated`
          : coreSuccess
          ? `Sync completed with warnings: ${totalData.servicesAdded + totalData.productsAdded} items added, ${totalData.servicesUpdated + totalData.productsUpdated} updated. ${errors.join(', ')}`
          : `Sync failed: ${errors.join(', ')}`,
        data: totalData,
        error: !coreSuccess ? errors.join('; ') : undefined
      }
    } catch (error) {
      console.error('Full sync error:', error)
      return {
        success: false,
        message: 'Full sync failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Update stock for a specific product
  async updateProductStock(productId: string, newStock: number, reason?: string, userId?: string): Promise<boolean> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      const oldStock = product.stock
      
      // Update product
      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: newStock,
          stockType: newStock > 0 ? StockType.LIMITED : StockType.OUT_OF_STOCK,
          updatedAt: new Date()
        }
      })

      // Record history
      await prisma.stockHistory.create({
        data: {
          productId: productId,
          type: StockHistoryType.MANUAL_ADJUSTMENT,
          quantity: newStock - (oldStock || 0),
          oldStock: oldStock,
          newStock: newStock,
          reason: reason || 'Manual stock adjustment',
          userId: userId
        }
      })

      return true
    } catch (error) {
      console.error('Update stock error:', error)
      return false
    }
  }

  // Check if a product has sufficient stock
  async checkProductStock(productId: string, quantity: number = 1): Promise<boolean> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product || !product.isActive) {
        return false
      }

      if (product.stockType === StockType.UNLIMITED) {
        return true
      }

      if (product.stockType === StockType.OUT_OF_STOCK) {
        return false
      }

      return (product.stock || 0) >= quantity
    } catch (error) {
      console.error('Check stock error:', error)
      return false
    }
  }

  // Reduce stock when order is placed
  async reduceStock(productId: string, quantity: number = 1, orderId?: string): Promise<boolean> {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      })

      if (!product) {
        throw new Error('Product not found')
      }

      if (product.stockType === StockType.UNLIMITED) {
        return true // No stock reduction needed for unlimited items
      }

      const currentStock = product.stock || 0
      if (currentStock < quantity) {
        throw new Error('Insufficient stock')
      }

      const newStock = currentStock - quantity

      // Update product stock
      await prisma.product.update({
        where: { id: productId },
        data: {
          stock: newStock,
          stockType: newStock > 0 ? StockType.LIMITED : StockType.OUT_OF_STOCK,
          updatedAt: new Date()
        }
      })

      // Record stock reduction
      await prisma.stockHistory.create({
        data: {
          productId: productId,
          type: StockHistoryType.ORDER_REDUCTION,
          quantity: -quantity,
          oldStock: currentStock,
          newStock: newStock,
          reason: orderId ? `Order: ${orderId}` : 'Stock reduction for order'
        }
      })

      return true
    } catch (error) {
      console.error('Reduce stock error:', error)
      return false
    }
  }

  // Get products with low stock
  async getLowStockProducts(): Promise<Array<{ id: string, name: string, stock: number, minStock: number }>> {
    try {
      const products = await prisma.product.findMany({
        where: {
          stockType: StockType.LIMITED,
          isActive: true,
          AND: {
            stock: {
              lte: prisma.product.fields.minStock
            }
          }
        },
        select: {
          id: true,
          name: true,
          stock: true,
          minStock: true
        }
      })

      return products.filter(p => 
        p.minStock && 
        p.stock !== null && 
        p.stock <= p.minStock
      ).map(p => ({
        id: p.id,
        name: p.name,
        stock: p.stock || 0,
        minStock: p.minStock || 0
      }))
    } catch (error) {
      console.error('Get low stock products error:', error)
      return []
    }
  }

  // Utility function to create slug from string
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }
}

export const vipSyncService = new VipSyncService()
