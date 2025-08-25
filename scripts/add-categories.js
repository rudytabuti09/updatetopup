const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addCategories() {
  console.log('🌱 Adding categories and services...')

  try {
    // Create Game Category
    const gameCategory = await prisma.category.upsert({
      where: { slug: 'game' },
      update: {},
      create: {
        name: 'Game Online',
        slug: 'game',
        description: 'Top up diamond, coin, dan item game online favorit',
        icon: '🎮',
        sortOrder: 1,
        isActive: true
      }
    })
    console.log('✅ Game category created')

    // Create Pulsa Category
    const pulsaCategory = await prisma.category.upsert({
      where: { slug: 'pulsa' },
      update: {},
      create: {
        name: 'Pulsa & Data',
        slug: 'pulsa',
        description: 'Isi pulsa dan paket data semua operator',
        icon: '📱',
        sortOrder: 2,
        isActive: true
      }
    })
    console.log('✅ Pulsa category created')

    // Create E-Money Category
    const emoneyCategory = await prisma.category.upsert({
      where: { slug: 'e-money' },
      update: {},
      create: {
        name: 'E-Money',
        slug: 'e-money',
        description: 'Top up saldo e-wallet dan payment digital',
        icon: '💳',
        sortOrder: 3,
        isActive: true
      }
    })
    console.log('✅ E-Money category created')

    // Create Game Services
    const gameServices = [
      { name: 'Mobile Legends', provider: 'mobile-legends', description: 'Top up diamond Mobile Legends Bang Bang' },
      { name: 'Free Fire', provider: 'free-fire', description: 'Top up diamond Free Fire' },
      { name: 'PUBG Mobile', provider: 'pubg-mobile', description: 'Top up UC PUBG Mobile' },
      { name: 'Call of Duty Mobile', provider: 'cod-mobile', description: 'Top up CP Call of Duty Mobile' },
      { name: 'Genshin Impact', provider: 'genshin-impact', description: 'Top up Genesis Crystal Genshin Impact' },
      { name: 'Valorant', provider: 'valorant', description: 'Top up Valorant Points' },
      { name: 'Honkai Star Rail', provider: 'honkai-star-rail', description: 'Top up Oneiric Shard Honkai Star Rail' }
    ]

    for (let i = 0; i < gameServices.length; i++) {
      const service = gameServices[i]
      await prisma.service.upsert({
        where: { provider: service.provider },
        update: {},
        create: {
          categoryId: gameCategory.id,
          name: service.name,
          slug: service.provider,
          description: service.description,
          provider: service.provider,
          sortOrder: i + 1,
          isActive: true
        }
      })
      console.log(`✅ ${service.name} service created`)
    }

    // Create Pulsa Services
    const pulsaServices = [
      { name: 'Telkomsel', provider: 'telkomsel', description: 'Isi pulsa dan paket data Telkomsel' },
      { name: 'Indosat Ooredoo', provider: 'indosat', description: 'Isi pulsa dan paket data Indosat' },
      { name: 'XL Axiata', provider: 'xl', description: 'Isi pulsa dan paket data XL' },
      { name: 'Tri (3)', provider: 'tri', description: 'Isi pulsa dan paket data Tri' },
      { name: 'Smartfren', provider: 'smartfren', description: 'Isi pulsa dan paket data Smartfren' }
    ]

    for (let i = 0; i < pulsaServices.length; i++) {
      const service = pulsaServices[i]
      await prisma.service.upsert({
        where: { provider: service.provider },
        update: {},
        create: {
          categoryId: pulsaCategory.id,
          name: service.name,
          slug: service.provider,
          description: service.description,
          provider: service.provider,
          sortOrder: i + 1,
          isActive: true
        }
      })
      console.log(`✅ ${service.name} service created`)
    }

    // Create E-Money Services
    const emoneyServices = [
      { name: 'GoPay', provider: 'gopay', description: 'Top up saldo GoPay' },
      { name: 'OVO', provider: 'ovo', description: 'Top up saldo OVO' },
      { name: 'DANA', provider: 'dana', description: 'Top up saldo DANA' },
      { name: 'ShopeePay', provider: 'shopeepay', description: 'Top up saldo ShopeePay' },
      { name: 'LinkAja', provider: 'linkaja', description: 'Top up saldo LinkAja' }
    ]

    for (let i = 0; i < emoneyServices.length; i++) {
      const service = emoneyServices[i]
      await prisma.service.upsert({
        where: { provider: service.provider },
        update: {},
        create: {
          categoryId: emoneyCategory.id,
          name: service.name,
          slug: service.provider,
          description: service.description,
          provider: service.provider,
          sortOrder: i + 1,
          isActive: true
        }
      })
      console.log(`✅ ${service.name} service created`)
    }

    console.log('\n🎉 All categories and services added successfully!')
    
    // Show summary
    const categoryCount = await prisma.category.count()
    const serviceCount = await prisma.service.count()
    console.log(`\n📊 Summary:`)
    console.log(`- Categories: ${categoryCount}`)
    console.log(`- Services: ${serviceCount}`)

  } catch (error) {
    console.error('❌ Error adding categories:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addCategories()
