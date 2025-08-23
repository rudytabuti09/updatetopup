import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nama, email, dan password harus diisi' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check if phone number already exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone }
      })

      if (existingPhone) {
        return NextResponse.json(
          { error: 'Nomor HP sudah terdaftar' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role: 'USER'
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Akun berhasil dibuat',
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}
