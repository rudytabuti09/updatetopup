import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { midtransAPI } from '@/lib/midtrans'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      serviceId,
      productId,
      customerId, // user game id or phone number
      nickname,
      email,
      phone,
      quantity = 1,
    } = body as {
      serviceId: string
      productId: string
      customerId: string
      nickname?: string
      email: string
      phone: string
      quantity?: number
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: { category: true }
    })
    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!service || !product) {
      return NextResponse.json({ success: false, error: 'Service or product not found' }, { status: 404 })
    }

    const amount = product.price * quantity
    const orderNumber = `WMX-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        serviceId: service.id,
        totalAmount: amount,
        status: 'WAITING_PAYMENT',
        customerData: {
          customerId,
          nickname,
          email,
          phone,
          product: { id: product.id, name: product.name },
          quantity,
        },
        items: {
          create: [
            {
              productId: product.id,
              quantity,
              price: product.price,
              total: amount,
            },
          ],
        },
      },
      include: { items: true },
    })

    // Create Midtrans payment
    const snap = await midtransAPI.createWMXPayment({
      orderId: order.orderNumber,
      amount: Math.round(amount),
      customerName: nickname || 'Pelanggan WMX',
      customerEmail: email,
      customerPhone: phone,
      items: [
        {
          id: product.sku,
          name: product.name,
          price: Math.round(product.price),
          quantity,
          category: product.category,
          brand: 'WMX TOPUP',
        },
      ],
    })

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: amount,
        method: 'E_WALLET',
        status: 'PENDING',
        paymentType: 'snap',
        expiryTime: new Date(Date.now() + 15 * 60 * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        snapToken: snap.token,
        snapRedirectUrl: snap.redirect_url,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      },
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}

