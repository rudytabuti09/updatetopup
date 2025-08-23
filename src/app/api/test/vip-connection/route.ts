import { NextResponse } from 'next/server'
import { vipResellerAPI } from '@/lib/vip-reseller'

export async function GET() {
  try {
    console.log('Testing VIP-Reseller connection...')
    
    // Test basic connectivity
    const services = await vipResellerAPI.getServices()
    
    // Test additional endpoints
    const tests = {
      services: services.length,
      connection: 'success',
      apiUrl: process.env.VIP_RESELLER_API_URL,
      hasApiKey: !!process.env.VIP_RESELLER_API_KEY,
      hasApiId: !!process.env.VIP_RESELLER_API_ID,
      timestamp: new Date().toISOString()
    }
    
    // Test stock endpoint (might fail if not available)
    try {
      const stockResponse = await vipResellerAPI.getStock()
      tests.stockEndpoint = stockResponse.result ? 'available' : 'limited'
    } catch (stockError) {
      tests.stockEndpoint = 'not available'
    }
    
    return NextResponse.json({
      success: true,
      message: `VIP-Reseller connection successful! Found ${services.length} services.`,
      data: tests,
      sampleServices: services.slice(0, 3) // Show first 3 services
    })
  } catch (error) {
    console.error('VIP-Reseller connection test failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'VIP-Reseller connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        apiUrl: process.env.VIP_RESELLER_API_URL || 'not set',
        hasApiKey: !!process.env.VIP_RESELLER_API_KEY,
        hasApiId: !!process.env.VIP_RESELLER_API_ID,
        timestamp: new Date().toISOString()
      }
    }, { status: 500 })
  }
}

// Health check endpoint
export async function POST() {
  try {
    // Test database connection
    const { prisma } = await import('@/lib/prisma')
    await prisma.$queryRaw`SELECT 1`
    
    // Test VIP-Reseller
    const services = await vipResellerAPI.getServices()
    
    return NextResponse.json({
      success: true,
      checks: {
        database: 'connected',
        vipReseller: 'connected',
        servicesCount: services.length,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
