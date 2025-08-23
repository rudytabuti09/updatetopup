import { NextRequest, NextResponse } from 'next/server'
import { vipResellerAPI } from '@/lib/vip-reseller'

// Check nickname for game services
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { service, userId } = body

    if (!service || !userId) {
      return NextResponse.json({
        success: false,
        error: 'Service and userId are required'
      }, { status: 400 })
    }

    // Get nickname from VIP-Reseller API
    const result = await vipResellerAPI.getNickname(service, userId)
    
    if (result.result && result.data?.nickname) {
      return NextResponse.json({
        success: true,
        nickname: result.data.nickname,
        service,
        userId
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || 'Nickname not found or service not supported',
        service,
        userId
      }, { status: 404 })
    }

  } catch (error) {
    console.error('Nickname API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to check nickname'
    }, { status: 500 })
  }
}
