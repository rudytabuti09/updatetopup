import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Only allow in development or with special token
    const isDev = process.env.NODE_ENV === 'development'
    const debugToken = request.nextUrl.searchParams.get('token')
    const hasValidToken = debugToken === process.env.DEBUG_TOKEN
    
    if (!isDev && !hasValidToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const envVars = {
      // Basic Node.js
      NODE_ENV: process.env.NODE_ENV,
      
      // NextAuth
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      
      // Database
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      
      // VIP Reseller
      VIP_RESELLER_API_URL: process.env.VIP_RESELLER_API_URL,
      VIP_RESELLER_API_KEY: process.env.VIP_RESELLER_API_KEY ? 'SET' : 'NOT_SET',
      VIP_RESELLER_API_ID: process.env.VIP_RESELLER_API_ID ? 'SET' : 'NOT_SET',
      
      // Midtrans
      MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY ? 'SET' : 'NOT_SET',
      MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ? 'SET' : 'NOT_SET',
      MIDTRANS_IS_PRODUCTION: process.env.MIDTRANS_IS_PRODUCTION,
      
      // App info
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    }

    // Check critical missing vars
    const criticalVars = [
      'NEXTAUTH_URL', 
      'NEXTAUTH_SECRET', 
      'DATABASE_URL'
    ]
    
    const missingCritical = criticalVars.filter(key => !process.env[key])

    return NextResponse.json({
      status: missingCritical.length === 0 ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      environment: envVars,
      missing_critical: missingCritical,
      platform: 'vercel',
      warnings: [
        ...(process.env.NODE_ENV !== 'production' ? ['NODE_ENV is not production'] : []),
        ...(process.env.NEXTAUTH_URL !== 'https://topup.wmxservices.store' ? ['NEXTAUTH_URL mismatch'] : []),
        ...(missingCritical.length > 0 ? [`Missing critical vars: ${missingCritical.join(', ')}`] : [])
      ]
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'ERROR',
      error: 'Environment check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
