/**
 * Script to create admin user for testing auth
 * Run: node create-admin-user.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  console.log('Creating admin user for testing...')
  
  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@wmx.local' }
    })

    if (existingUser) {
      console.log('✅ Admin user already exists:')
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Role: ${existingUser.role}`)
      console.log(`   Created: ${existingUser.createdAt}`)
      return existingUser
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@wmx.local',
        name: 'WMX Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        balance: 1000000, // 1 million for testing
        isActive: true
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Password: admin123`)
    console.log(`   Role: ${adminUser.role}`)
    console.log(`   Balance: Rp ${adminUser.balance.toLocaleString()}`)
    
    return adminUser
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

async function createTestUser() {
  console.log('Creating test user...')
  
  try {
    // Check if test user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'user@wmx.local' }
    })

    if (existingUser) {
      console.log('✅ Test user already exists:')
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Role: ${existingUser.role}`)
      return existingUser
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('user123', 12)

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'user@wmx.local',
        name: 'Test User',
        password: hashedPassword,
        role: 'USER',
        balance: 50000, // 50k for testing
        isActive: true
      }
    })

    console.log('✅ Test user created successfully!')
    console.log(`   Email: ${testUser.email}`)
    console.log(`   Password: user123`)
    console.log(`   Role: ${testUser.role}`)
    console.log(`   Balance: Rp ${testUser.balance.toLocaleString()}`)
    
    return testUser
  } catch (error) {
    console.error('❌ Error creating test user:', error.message)
    throw error
  }
}

async function main() {
  console.log('🚀 Setting up test users...\n')
  
  try {
    await createAdminUser()
    console.log()
    await createTestUser()
    
    console.log('\n🎉 Test users setup complete!')
    console.log('\nYou can now login with:')
    console.log('Admin: admin@wmx.local / admin123')
    console.log('User: user@wmx.local / user123')
    
  } catch (error) {
    console.error('\n💥 Setup failed:', error.message)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}

module.exports = { createAdminUser, createTestUser }
