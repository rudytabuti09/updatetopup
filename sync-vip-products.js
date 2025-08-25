/**
 * Script untuk sync products dari VIP-Reseller ke database
 * 
 * Usage: node sync-vip-products.js [options]
 * Options:
 *   --services-only   Sync services only
 *   --products-only   Sync products only
 *   --stock-only      Sync stock only
 *   --full           Full sync (default)
 */

require('dotenv').config()
const { vipSyncService } = require('./src/lib/services/vip-sync')

async function syncVipProducts(options = {}) {
  console.log('🚀 Starting VIP-Reseller Products Sync...\n')
  
  const {
    servicesOnly = false,
    productsOnly = false,
    stockOnly = false,
    full = true
  } = options

  try {
    let results = []

    if (servicesOnly || full) {
      console.log('📋 Syncing Services...')
      const servicesResult = await vipSyncService.syncServices()
      results.push({ type: 'Services', result: servicesResult })
      
      if (servicesResult.success) {
        console.log(`✅ Services: ${servicesResult.data?.servicesAdded || 0} added, ${servicesResult.data?.servicesUpdated || 0} updated`)
      } else {
        console.log(`❌ Services sync failed: ${servicesResult.message}`)
      }
      console.log('')
    }

    if (productsOnly || full) {
      console.log('💰 Syncing Products...')
      const productsResult = await vipSyncService.syncProducts()
      results.push({ type: 'Products', result: productsResult })
      
      if (productsResult.success) {
        console.log(`✅ Products: ${productsResult.data?.productsAdded || 0} added, ${productsResult.data?.productsUpdated || 0} updated`)
      } else {
        console.log(`❌ Products sync failed: ${productsResult.message}`)
      }
      console.log('')
    }

    if (stockOnly || full) {
      console.log('📦 Syncing Stock...')
      const stockResult = await vipSyncService.syncStock()
      results.push({ type: 'Stock', result: stockResult })
      
      if (stockResult.success) {
        console.log(`✅ Stock: ${stockResult.data?.stockUpdated || 0} products updated`)
      } else {
        console.log(`❌ Stock sync failed: ${stockResult.message}`)
      }
      console.log('')
    }

    // Summary
    console.log('📊 SYNC SUMMARY:')
    console.log('=' .repeat(50))
    
    let totalSuccess = 0
    let totalFailed = 0
    let totalAdded = 0
    let totalUpdated = 0

    results.forEach(({ type, result }) => {
      const status = result.success ? '✅' : '❌'
      console.log(`${status} ${type}: ${result.message}`)
      
      if (result.success) {
        totalSuccess++
        if (result.data) {
          totalAdded += (result.data.servicesAdded || 0) + (result.data.productsAdded || 0)
          totalUpdated += (result.data.servicesUpdated || 0) + (result.data.productsUpdated || 0) + (result.data.stockUpdated || 0)
        }
      } else {
        totalFailed++
        if (result.error) {
          console.log(`   Error: ${result.error}`)
        }
      }
    })

    console.log('')
    console.log(`📈 Total Added: ${totalAdded}`)
    console.log(`🔄 Total Updated: ${totalUpdated}`)
    console.log(`✅ Successful Operations: ${totalSuccess}`)
    console.log(`❌ Failed Operations: ${totalFailed}`)

    if (totalFailed === 0) {
      console.log('\n🎉 All sync operations completed successfully!')
    } else {
      console.log('\n⚠️  Some sync operations failed. Check the errors above.')
    }

    console.log('\n📋 NEXT STEPS:')
    console.log('1. Check admin panel: http://localhost:3000/admin/catalog')
    console.log('2. View products: http://localhost:3000/admin/products')
    console.log('3. Monitor stock: http://localhost:3000/admin/stock')
    console.log('4. Set up webhook URL in VIP-Reseller dashboard')

  } catch (error) {
    console.error('❌ Sync failed with error:', error.message)
    console.log('\n🔧 TROUBLESHOOTING:')
    console.log('1. Check database connection')
    console.log('2. Verify VIP-Reseller API credentials')
    console.log('3. Check network connectivity')
    console.log('4. Run: npm run db:push (if schema changes needed)')
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {}

  if (args.includes('--services-only')) {
    options.servicesOnly = true
    options.full = false
  }
  
  if (args.includes('--products-only')) {
    options.productsOnly = true
    options.full = false
  }
  
  if (args.includes('--stock-only')) {
    options.stockOnly = true
    options.full = false
  }
  
  if (args.includes('--full')) {
    options.full = true
  }

  return options
}

// Main execution
async function main() {
  console.log('=' .repeat(60))
  console.log('         VIP-RESELLER PRODUCTS SYNC')
  console.log('=' .repeat(60))
  
  const options = parseArgs()
  await syncVipProducts(options)
  
  console.log('\n' + '=' .repeat(60))
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = { syncVipProducts }
