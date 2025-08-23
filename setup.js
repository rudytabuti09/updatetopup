#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 WMX TOPUP - Setup Script')
console.log('===========================')

// Check if .env file exists
const envPath = path.join(__dirname, '.env')
const envExamplePath = path.join(__dirname, '.env.example')

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📄 Creating .env file from .env.example...')
    fs.copyFileSync(envExamplePath, envPath)
    console.log('✅ .env file created! Please update it with your credentials.')
  } else {
    console.log('❌ .env.example not found!')
    process.exit(1)
  }
} else {
  console.log('✅ .env file already exists')
}

// Check Node.js version
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.log(`❌ Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`)
  process.exit(1)
}
console.log(`✅ Node.js version ${nodeVersion} is supported`)

// Install dependencies
console.log('\n📦 Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed successfully!')
} catch (error) {
  console.log('❌ Failed to install dependencies')
  console.error(error.message)
  process.exit(1)
}

// Generate Prisma client
console.log('\n🔧 Generating Prisma client...')
try {
  execSync('npm run db:generate', { stdio: 'inherit' })
  console.log('✅ Prisma client generated successfully!')
} catch (error) {
  console.log('❌ Failed to generate Prisma client')
  console.error(error.message)
}

console.log('\n🎉 Setup completed!')
console.log('\nNext steps:')
console.log('1. Update .env file with your credentials')
console.log('2. Setup your PostgreSQL database')
console.log('3. Run: npm run db:push')
console.log('4. Run: npm run db:seed')
console.log('5. Run: npm run dev')
console.log('\nDemo accounts after seeding:')
console.log('- Admin: admin@wmx.com / admin123')
console.log('- User: user@wmx.com / user123')

console.log('\nHappy coding! 🚀')
