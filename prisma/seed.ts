import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const hashedAdminPassword = await bcryptjs.hash('admin123', 10)
  const hashedUserPassword = await bcryptjs.hash('user123', 10)

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@wmx.com' },
    update: {},
    create: {
      email: 'admin@wmx.com',
      name: 'Admin WMX',
      password: hashedAdminPassword,
      role: 'ADMIN',
      balance: 1000000,
    },
  })

  const testUser = await prisma.user.upsert({
    where: { email: 'user@wmx.com' },
    update: {},
    create: {
      email: 'user@wmx.com',
      name: 'Test User',
      phone: '081234567890',
      password: hashedUserPassword,
      role: 'USER',
      balance: 100000,
    },
  })

  // Create categories
  const gameCategory = await prisma.category.upsert({
    where: { slug: 'game' },
    update: {},
    create: {
      name: 'Game Online',
      slug: 'game',
      description: 'Top up diamond, coin, dan item game online favorit',
      icon: '🎮',
      sortOrder: 1,
    },
  })

  const pulsaCategory = await prisma.category.upsert({
    where: { slug: 'pulsa' },
    update: {},
    create: {
      name: 'Pulsa & Data',
      slug: 'pulsa',
      description: 'Isi pulsa dan paket data semua operator',
      icon: '📱',
      sortOrder: 2,
    },
  })

  const emoneyCategory = await prisma.category.upsert({
    where: { slug: 'e-money' },
    update: {},
    create: {
      name: 'E-Money',
      slug: 'e-money',
      description: 'Top up saldo e-wallet dan payment digital',
      icon: '💳',
      sortOrder: 3,
    },
  })

  // Create services - Games
  const mobileLegends = await prisma.service.upsert({
    where: { provider: 'mobile-legends' },
    update: {},
    create: {
      categoryId: gameCategory.id,
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      description: 'Top up diamond Mobile Legends Bang Bang terpercaya',
      provider: 'mobile-legends',
      sortOrder: 1,
    },
  })

  const freeFire = await prisma.service.upsert({
    where: { provider: 'free-fire' },
    update: {},
    create: {
      categoryId: gameCategory.id,
      name: 'Free Fire',
      slug: 'free-fire',
      description: 'Top up diamond Free Fire termurah dan tercepat',
      provider: 'free-fire',
      sortOrder: 2,
    },
  })

  const pubgMobile = await prisma.service.upsert({
    where: { provider: 'pubg-mobile' },
    update: {},
    create: {
      categoryId: gameCategory.id,
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      description: 'Top up UC PUBG Mobile terbaik',
      provider: 'pubg-mobile',
      sortOrder: 3,
    },
  })

  // Create services - Pulsa
  const telkomsel = await prisma.service.upsert({
    where: { provider: 'telkomsel' },
    update: {},
    create: {
      categoryId: pulsaCategory.id,
      name: 'Telkomsel',
      slug: 'telkomsel',
      description: 'Isi pulsa dan paket data Telkomsel',
      provider: 'telkomsel',
      sortOrder: 1,
    },
  })

  const indosat = await prisma.service.upsert({
    where: { provider: 'indosat' },
    update: {},
    create: {
      categoryId: pulsaCategory.id,
      name: 'Indosat Ooredoo',
      slug: 'indosat',
      description: 'Isi pulsa dan paket data Indosat',
      provider: 'indosat',
      sortOrder: 2,
    },
  })

  // Create services - E-Money
  const gopay = await prisma.service.upsert({
    where: { provider: 'gopay' },
    update: {},
    create: {
      categoryId: emoneyCategory.id,
      name: 'GoPay',
      slug: 'gopay',
      description: 'Top up saldo GoPay',
      provider: 'gopay',
      sortOrder: 1,
    },
  })

  const ovo = await prisma.service.upsert({
    where: { provider: 'ovo' },
    update: {},
    create: {
      categoryId: emoneyCategory.id,
      name: 'OVO',
      slug: 'ovo',
      description: 'Top up saldo OVO',
      provider: 'ovo',
      sortOrder: 2,
    },
  })

  // Create products for Mobile Legends
  const mlProducts = [
    { name: '86 Diamond', price: 15000, sku: 'ML86' },
    { name: '172 Diamond', price: 28000, sku: 'ML172' },
    { name: '257 Diamond', price: 42000, sku: 'ML257' },
    { name: '344 Diamond', price: 55000, sku: 'ML344' },
    { name: '429 Diamond', price: 70000, sku: 'ML429' },
    { name: '514 Diamond', price: 85000, sku: 'ML514' },
    { name: '706 Diamond', price: 115000, sku: 'ML706' },
    { name: '1050 Diamond', price: 170000, sku: 'ML1050' },
  ]

  for (const product of mlProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        serviceId: mobileLegends.id,
        name: product.name,
        price: product.price,
        buyPrice: product.price * 0.95, // 5% margin
        profit: product.price * 0.05,
        sku: product.sku,
        category: 'game',
        sortOrder: mlProducts.indexOf(product) + 1,
      },
    })
  }

  // Create products for Free Fire
  const ffProducts = [
    { name: '70 Diamond', price: 10000, sku: 'FF70' },
    { name: '140 Diamond', price: 19000, sku: 'FF140' },
    { name: '210 Diamond', price: 28000, sku: 'FF210' },
    { name: '355 Diamond', price: 48000, sku: 'FF355' },
    { name: '720 Diamond', price: 95000, sku: 'FF720' },
    { name: '1450 Diamond', price: 190000, sku: 'FF1450' },
  ]

  for (const product of ffProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        serviceId: freeFire.id,
        name: product.name,
        price: product.price,
        buyPrice: product.price * 0.95,
        profit: product.price * 0.05,
        sku: product.sku,
        category: 'game',
        sortOrder: ffProducts.indexOf(product) + 1,
      },
    })
  }

  // Create products for PUBG Mobile
  const pubgProducts = [
    { name: '60 UC', price: 12000, sku: 'PUBG60' },
    { name: '325 UC', price: 58000, sku: 'PUBG325' },
    { name: '660 UC', price: 115000, sku: 'PUBG660' },
    { name: '1800 UC', price: 285000, sku: 'PUBG1800' },
  ]

  for (const product of pubgProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        serviceId: pubgMobile.id,
        name: product.name,
        price: product.price,
        buyPrice: product.price * 0.95,
        profit: product.price * 0.05,
        sku: product.sku,
        category: 'game',
        sortOrder: pubgProducts.indexOf(product) + 1,
      },
    })
  }

  // Create products for Telkomsel
  const telkomselProducts = [
    { name: 'Pulsa 10.000', price: 11000, sku: 'TSEL10K' },
    { name: 'Pulsa 25.000', price: 26000, sku: 'TSEL25K' },
    { name: 'Pulsa 50.000', price: 51000, sku: 'TSEL50K' },
    { name: 'Pulsa 100.000', price: 101000, sku: 'TSEL100K' },
  ]

  for (const product of telkomselProducts) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: {
        serviceId: telkomsel.id,
        name: product.name,
        price: product.price,
        buyPrice: product.price * 0.98,
        profit: product.price * 0.02,
        sku: product.sku,
        category: 'pulsa',
        sortOrder: telkomselProducts.indexOf(product) + 1,
      },
    })
  }

  // Create config entries
  const configs = [
    { key: 'app_name', value: 'WMX TOPUP', type: 'string' },
    { key: 'app_url', value: 'https://wmxtopup.com', type: 'string' },
    { key: 'min_deposit', value: '10000', type: 'number' },
    { key: 'max_deposit', value: '10000000', type: 'number' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' },
    { key: 'whatsapp_number', value: '6281234567890', type: 'string' },
    { key: 'telegram_channel', value: '@wmxtopup', type: 'string' },
  ]

  for (const config of configs) {
    await prisma.config.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  // Create sample banners
  await prisma.banner.upsert({
    where: { id: 'sample-banner-1' },
    update: {},
    create: {
      id: 'sample-banner-1',
      title: 'Promo Spesial!',
      subtitle: 'Discount 10% untuk top up pertama',
      image: '/banners/promo-1.jpg',
      link: '/catalog?promo=first-time',
      sortOrder: 1,
    },
  })

  await prisma.banner.upsert({
    where: { id: 'sample-banner-2' },
    update: {},
    create: {
      id: 'sample-banner-2',
      title: 'Event Mobile Legends',
      subtitle: 'Bonus diamond untuk pembelian tertentu',
      image: '/banners/ml-event.jpg',
      link: '/catalog/mobile-legends',
      sortOrder: 2,
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created data:')
  console.log(`- ${await prisma.user.count()} users`)
  console.log(`- ${await prisma.category.count()} categories`)
  console.log(`- ${await prisma.service.count()} services`)
  console.log(`- ${await prisma.product.count()} products`)
  console.log(`- ${await prisma.config.count()} config entries`)
  console.log(`- ${await prisma.banner.count()} banners`)
  
  console.log('\n🔑 Demo credentials:')
  console.log('Admin: admin@wmx.com / admin123')
  console.log('User: user@wmx.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
