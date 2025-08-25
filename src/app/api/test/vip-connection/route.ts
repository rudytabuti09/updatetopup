import { NextResponse } from 'next/server'
import { vipResellerAPI } from '@/lib/vip-reseller'

export async function GET() {
  try {
    console.log('Testing VIP-Reseller connection...')
    
    // Try profile first (usually less restricted)
    let connectionTest: Record<string, unknown> | null = null
    let testMethod = ''
    
    try {
      const profile = await vipResellerAPI.getProfile()
      connectionTest = {
        profile: {
          username: profile.username,
          name: profile.name,
          balance: profile.balance,
          level: profile.level,
          status: profile.status
        }
      }
      testMethod = 'profile'
    } catch (profileError) {
      console.warn('Profile endpoint failed, trying services...')
      
      // Fallback to services
      const services = await vipResellerAPI.getServices()
      connectionTest = {
        services: {
          count: services.length,
          samples: services.slice(0, 3).map(s => ({
            name: s.name,
            category: s.category,
            status: s.status
          }))
        }
      }
      testMethod = 'services'
    }
    
    // Test additional endpoints
    const tests: Record<string, unknown> = {
      ...connectionTest,
      connection: 'success',
      testMethod,
      apiUrl: process.env.VIP_RESELLER_API_URL,
      hasApiKey: !!process.env.VIP_RESELLER_API_KEY,
      hasApiId: !!process.env.VIP_RESELLER_API_ID,
      timestamp: new Date().toISOString()
    }
    
    // Test stock endpoint (might fail if not available)
    try {
      const stockResponse = await vipResellerAPI.getStock()
      tests.stockEndpoint = stockResponse.result ? 'available' : 'limited'
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      const isCloudflareBlock = errorMsg.includes('Cloudflare')
      tests.stockEndpoint = isCloudflareBlock ? 'blocked by cloudflare' : 'not available'
    }
    
    return NextResponse.json({
      success: true,
      message: `VIP-Reseller connection successful via ${testMethod}!`,
      data: tests
    })
  } catch (error) {
    console.error('VIP-Reseller connection test failed:', error)
    
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    const isCloudflareBlock = errorMsg.includes('Cloudflare')
    
    return NextResponse.json({
      success: false,
      message: isCloudflareBlock 
        ? 'VIP-Reseller API is currently protected by Cloudflare'
        : 'VIP-Reseller connection failed',
      error: errorMsg,
      isCloudflareBlock,
      recommendations: isCloudflareBlock ? [
        'Wait a few minutes and try again',
        'Cloudflare protection is usually temporary',
        'The API may be experiencing high traffic or DDoS protection is active'
      ] : [
        'Check VIP-Reseller API credentials',
        'Verify API endpoint URL',
        'Check network connectivity'
      ],
      debug: {
        apiUrl: process.env.VIP_RESELLER_API_URL || 'not set',
        hasApiKey: !!process.env.VIP_RESELLER_API_KEY,
        hasApiId: !!process.env.VIP_RESELLER_API_ID,
        timestamp: new Date().toISOString()
      }
    }, { status: isCloudflareBlock ? 503 : 500 })
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
