import { NextRequest, NextResponse } from 'next/server'
import { vipResellerAPI } from '@/lib/vip-reseller'
import { prisma } from '@/lib/prisma'

// Get services and products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const cached = searchParams.get('cached') === 'true'

    // If cached is requested, get from database first
    if (cached) {
      const services = await prisma.service.findMany({
        where: {
          AND: [
            category ? { 
              category: { 
                slug: category,
                isActive: true
              } 
            } : {},
            search ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            } : {},
            { isActive: true }
          ]
        },
        include: {
          category: true,
          products: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      })

      return NextResponse.json({
        success: true,
        data: services,
        source: 'database'
      })
    }

    // Get fresh data from VIP-Reseller API
    try {
      const [services, products] = await Promise.all([
        vipResellerAPI.getServices(),
        vipResellerAPI.getPriceList()
      ])

      // Group products by service
      const servicesWithProducts = services.map(service => ({
        ...service,
        products: products.filter(product => product.service === service.service)
      }))

      // Filter by category and search if provided
      let filteredServices = servicesWithProducts

      if (category) {
        filteredServices = filteredServices.filter(service => 
          service.category.toLowerCase() === category.toLowerCase()
        )
      }

      if (search) {
        const searchTerm = search.toLowerCase()
        filteredServices = filteredServices.filter(service => 
          service.name.toLowerCase().includes(searchTerm) ||
          service.brand.toLowerCase().includes(searchTerm)
        )
      }

      return NextResponse.json({
        success: true,
        data: filteredServices,
        source: 'vip-reseller'
      })

    } catch (vipError) {
      console.error('VIP-Reseller API error:', vipError)
      
      // Fallback to database if VIP API fails
      const services = await prisma.service.findMany({
        where: {
          AND: [
            category ? { 
              category: { 
                slug: category,
                isActive: true
              } 
            } : {},
            search ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
              ]
            } : {},
            { isActive: true }
          ]
        },
        include: {
          category: true,
          products: {
            where: { isActive: true },
            orderBy: { sortOrder: 'asc' }
          }
        },
        orderBy: { sortOrder: 'asc' }
      })

      return NextResponse.json({
        success: true,
        data: services,
        source: 'database',
        warning: 'Using cached data - API temporarily unavailable'
      })
    }

  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch services'
    }, { status: 500 })
  }
}

// Update services in database from VIP-Reseller API
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'sync') {
      // Sync services and products from VIP-Reseller to database
      const [services, products] = await Promise.all([
        vipResellerAPI.getServices(),
        vipResellerAPI.getPriceList()
      ])

      // Group services by category for processing
      const categoryMap = new Map()
      
      for (const service of services) {
        if (!categoryMap.has(service.category)) {
          categoryMap.set(service.category, [])
        }
        categoryMap.get(service.category).push(service)
      }

      // Sync categories
      for (const [categoryName] of categoryMap) {
        await prisma.category.upsert({
          where: { name: categoryName },
          create: {
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: `${categoryName} services`
          },
          update: {
            isActive: true
          }
        })
      }

      // Sync services
      for (const service of services) {
        const category = await prisma.category.findUnique({
          where: { name: service.category }
        })

        if (category) {
          const dbService = await prisma.service.upsert({
            where: { provider: service.service },
            create: {
              categoryId: category.id,
              name: service.name,
              slug: service.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              description: service.note,
              provider: service.service,
              isActive: service.status === 'available'
            },
            update: {
              name: service.name,
              description: service.note,
              isActive: service.status === 'available'
            }
          })

          // Sync products for this service
          const serviceProducts = products.filter(p => p.service === service.service)
          
          for (const product of serviceProducts) {
            await prisma.product.upsert({
              where: { sku: product.id },
              create: {
                serviceId: dbService.id,
                name: product.name,
                price: product.price.basic,
                buyPrice: product.price.basic * 0.95, // Assume 5% margin
                profit: product.price.basic * 0.05,
                sku: product.id,
                category: service.category,
                isActive: product.status === 'available'
              },
              update: {
                name: product.name,
                price: product.price.basic,
                buyPrice: product.price.basic * 0.95,
                profit: product.price.basic * 0.05,
                isActive: product.status === 'available'
              }
            })
          }
        }
      }

      return NextResponse.json({
        success: true,
        message: `Synced ${services.length} services and ${products.length} products`,
        data: {
          services: services.length,
          products: products.length,
          categories: categoryMap.size
        }
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Services sync error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to sync services'
    }, { status: 500 })
  }
}
