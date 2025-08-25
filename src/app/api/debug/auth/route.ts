import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Comprehensive environment check
    const requiredVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'VIP_RESELLER_API_KEY',
      'VIP_RESELLER_API_ID',
      'MIDTRANS_SERVER_KEY',
      'MIDTRANS_CLIENT_KEY'
    ]

    const envCheck = {
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
      VIP_RESELLER_API_KEY: process.env.VIP_RESELLER_API_KEY ? 'SET' : 'NOT_SET',
      VIP_RESELLER_API_ID: process.env.VIP_RESELLER_API_ID ? 'SET' : 'NOT_SET',
      MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY ? 'SET' : 'NOT_SET',
      MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY ? 'SET' : 'NOT_SET',
    }

    // Check which variables are missing
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    const hasAllRequired = missingVars.length === 0

    // NextAuth specific checks
    const nextAuthChecks = {
      hasSecret: !!process.env.NEXTAUTH_SECRET,
      hasUrl: !!process.env.NEXTAUTH_URL,
      urlMatches: process.env.NEXTAUTH_URL === 'https://topup.wmxservices.store',
      secretLength: process.env.NEXTAUTH_SECRET ? process.env.NEXTAUTH_SECRET.length : 0
    }

    // Database check
    const dbCheck = {
      hasUrl: !!process.env.DATABASE_URL,
      isPostgres: process.env.DATABASE_URL?.startsWith('postgresql://') || false
    }

    const result = {
      status: hasAllRequired ? 'OK' : 'ERROR',
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        platform: 'vercel',
        hasAllRequired
      },
      environmentVariables: envCheck,
      missingVariables: missingVars,
      nextauth: nextAuthChecks,
      database: dbCheck,
      recommendations: [] as string[]
    }

    // Add recommendations
    if (missingVars.length > 0) {
      result.recommendations.push('Set missing environment variables in Vercel Dashboard')
    }
    if (!nextAuthChecks.urlMatches) {
      result.recommendations.push('NEXTAUTH_URL should match your domain: https://topup.wmxservices.store')
    }
    if (nextAuthChecks.secretLength < 32) {
      result.recommendations.push('NEXTAUTH_SECRET should be at least 32 characters long')
    }

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'ERROR',
        error: 'Debug endpoint failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
