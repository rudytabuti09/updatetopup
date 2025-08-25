/**
 * Script untuk melihat semua products yang tersedia di VIP-Reseller
 * 
 * Usage: node check-vip-products.js
 */

require('dotenv').config()
const { vipResellerAPI } = require('./src/lib/vip-reseller')

async function checkVipProducts() {
  console.log('🔍 Checking VIP-Reseller Products...\n')
  
  try {
    // 1. Get Game Feature Products
    console.log('🎮 GAME FEATURE PRODUCTS:')
    console.log('=' .repeat(50))
    
    const gameServices = await vipResellerAPI.getServices()
    console.log(`Found ${gameServices.length} game services`)
    
    // Show sample services
    gameServices.slice(0, 10).forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`)
      console.log(`   Code: ${service.service}`)
      console.log(`   Category: ${service.category}`)
      console.log(`   Brand: ${service.brand}`)
      console.log(`   Status: ${service.status}`)
      console.log('')
    })

    // Get price list
    const gameProducts = await vipResellerAPI.getPriceList()
    console.log(`\n💰 Found ${gameProducts.length} game products with pricing`)
    
    // Show sample products with prices
    gameProducts.slice(0, 5).forEach((product, index) => {
      const price = product.price.basic || product.price.premium || product.price.special
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   SKU: ${product.service}`)
      console.log(`   Price: Rp ${price.toLocaleString('id-ID')}`)
      console.log(`   Status: ${product.status}`)
      console.log('')
    })

    // 2. Get Prepaid Products  
    console.log('\n💳 PREPAID PRODUCTS:')
    console.log('=' .repeat(50))
    
    try {
      const prepaidServices = await vipResellerAPI.getPrepaidServices()
      console.log(`Found ${prepaidServices.length} prepaid services`)
      
      prepaidServices.slice(0, 10).forEach((service, index) => {
        console.log(`${index + 1}. ${service.name}`)
        console.log(`   Code: ${service.service}`)
        console.log(`   Category: ${service.category}`)
        console.log(`   Brand: ${service.brand}`)
        console.log('')
      })
    } catch (error) {
      console.log(`⚠️  Prepaid API not available: ${error.message}`)
    }

    // 3. Get Social Media Products
    console.log('\n📱 SOCIAL MEDIA PRODUCTS:')
    console.log('=' .repeat(50))
    
    try {
      const socialServices = await vipResellerAPI.getSocialMediaServices()
      console.log(`Found ${socialServices.length} social media services`)
      
      socialServices.slice(0, 10).forEach((service, index) => {
        console.log(`${index + 1}. ${service.name}`)
        console.log(`   Code: ${service.service}`)
        console.log(`   Category: ${service.category}`)
        console.log(`   Brand: ${service.brand}`)
        console.log('')
      })
    } catch (error) {
      console.log(`⚠️  Social Media API not available: ${error.message}`)
    }

    // 4. Stock Information (if available)
    console.log('\n📦 STOCK INFORMATION:')
    console.log('=' .repeat(50))
    
    try {
      const stockResponse = await vipResellerAPI.getStock()
      if (stockResponse.result) {
        console.log(`Found stock data for ${stockResponse.data.length} products`)
        
        stockResponse.data.slice(0, 10).forEach((stock, index) => {
          console.log(`${index + 1}. ${stock.name}`)
          console.log(`   Service: ${stock.service}`)
          console.log(`   Stock: ${stock.stock}`)
          console.log(`   Status: ${stock.status}`)
          console.log('')
        })
      } else {
        console.log(`⚠️  Stock API response: ${stockResponse.message}`)
      }
    } catch (error) {
      console.log(`⚠️  Stock API not available: ${error.message}`)
    }

    console.log('\n✅ Product check complete!')
    console.log('\n📋 NEXT STEPS:')
    console.log('1. Run full sync: node sync-vip-products.js')
    console.log('2. Or use admin panel: http://localhost:3000/admin/catalog')
    console.log('3. Check database for imported products')

  } catch (error) {
    console.error('❌ Error checking products:', error.message)
    console.log('\n🔧 TROUBLESHOOTING:')
    console.log('1. Check your .env file for VIP_RESELLER_API_KEY and VIP_RESELLER_API_ID')
    console.log('2. Ensure you have internet connection')
    console.log('3. Verify VIP-Reseller API credentials are valid')
  }
}

// Run the check
if (require.main === module) {
  checkVipProducts().catch(console.error)
}

module.exports = { checkVipProducts }
