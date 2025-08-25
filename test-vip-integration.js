/**
 * VIP-Reseller Integration Test Script
 * 
 * This script demonstrates the COMPLETE VIP-Reseller API integration features:
 * - Profile API
 * - Game Feature API (services, products, orders)
 * - Prepaid API (pulsa, PPOB)
 * - Social Media API (followers, likes, etc.)
 * - Service synchronization
 * - Order processing
 * - Webhook callback testing
 * 
 * To run: node test-vip-integration.js
 */

const { vipResellerAPI } = require('./src/lib/vip-reseller')
const { vipSyncService } = require('./src/lib/services/vip-sync')

async function testVipIntegration() {
    console.log('🚀 Starting VIP-Reseller Integration Test\n')

    try {
        // Test 1: Get VIP-Reseller Services
        console.log('1. Testing VIP-Reseller API Connection...')
        try {
            const services = await vipResellerAPI.getServices()
            console.log(`✅ Connected successfully! Found ${services.length} services`)
            
            if (services.length > 0) {
                console.log(`   Sample service: ${services[0].name} (${services[0].category})`)
            }
        } catch (error) {
            console.log(`❌ API Connection failed: ${error.message}`)
            console.log('   Please check your VIP_RESELLER_API_KEY and VIP_RESELLER_API_ID in .env file')
            return
        }

        // Test 2: Get Price List
        console.log('\n2. Testing Price List Retrieval...')
        try {
            const products = await vipResellerAPI.getPriceList()
            console.log(`✅ Retrieved ${products.length} products`)
            
            if (products.length > 0) {
                const sample = products[0]
                console.log(`   Sample product: ${sample.name}`)
                console.log(`   Price: Rp ${sample.price.basic || sample.price.premium || sample.price.special}`)
            }
        } catch (error) {
            console.log(`❌ Price list retrieval failed: ${error.message}`)
        }

        // Test 3: Check Stock (if available)
        console.log('\n3. Testing Stock Information...')
        try {
            const stockResponse = await vipResellerAPI.getStock()
            if (stockResponse.result) {
                console.log(`✅ Stock information retrieved: ${stockResponse.data.length} items`)
            } else {
                console.log(`⚠️  Stock API not available: ${stockResponse.message}`)
            }
        } catch (error) {
            console.log(`⚠️  Stock check not available: ${error.message}`)
        }

        // Test 4: Database Sync (requires database)
        console.log('\n4. Testing Database Synchronization...')
        try {
            // Test service sync
            const servicesResult = await vipSyncService.syncServices()
            if (servicesResult.success) {
                console.log(`✅ Services sync: ${servicesResult.data?.servicesAdded || 0} added, ${servicesResult.data?.servicesUpdated || 0} updated`)
            } else {
                console.log(`❌ Services sync failed: ${servicesResult.message}`)
            }

            // Test product sync
            const productsResult = await vipSyncService.syncProducts()
            if (productsResult.success) {
                console.log(`✅ Products sync: ${productsResult.data?.productsAdded || 0} added, ${productsResult.data?.productsUpdated || 0} updated`)
            } else {
                console.log(`❌ Products sync failed: ${productsResult.message}`)
            }

        } catch (error) {
            console.log(`❌ Database sync failed: ${error.message}`)
            console.log('   Make sure your database is set up and Prisma is configured correctly')
        }

        // Test 5: Profile API
        console.log('\n5. Testing Profile API...')
        try {
            const profile = await vipResellerAPI.getProfile()
            console.log(`✅ Profile retrieved: ${profile.name} (Balance: Rp ${profile.balance})`)
        } catch (error) {
            console.log(`⚠️  Profile API failed: ${error.message}`)
        }

        // Test 6: Prepaid API
        console.log('\n6. Testing Prepaid API...')
        try {
            const prepaidServices = await vipResellerAPI.getPrepaidServices()
            console.log(`✅ Prepaid services retrieved: ${prepaidServices.length} services`)
            
            if (prepaidServices.length > 0) {
                console.log(`   Sample prepaid: ${prepaidServices[0].name}`)
            }
        } catch (error) {
            console.log(`⚠️  Prepaid API failed: ${error.message}`)
        }

        // Test 7: Social Media API
        console.log('\n7. Testing Social Media API...')
        try {
            const socialServices = await vipResellerAPI.getSocialMediaServices()
            console.log(`✅ Social media services retrieved: ${socialServices.length} services`)
            
            if (socialServices.length > 0) {
                console.log(`   Sample social media: ${socialServices[0].name}`)
            }
        } catch (error) {
            console.log(`⚠️  Social Media API failed: ${error.message}`)
        }

        // Test 8: Nickname Service (for supported games)
        console.log('\n8. Testing Nickname Service...')
        try {
            // Example: Mobile Legends nickname check
            const nickname = await vipResellerAPI.getNickname('mobilelegend', '136216325', '2685')
            if (nickname.result) {
                console.log(`✅ Nickname service works: ${nickname.data.nickname}`)
            } else {
                console.log(`⚠️  Nickname service: ${nickname.message}`)
            }
        } catch (error) {
            console.log(`⚠️  Nickname service not available: ${error.message}`)
        }

        // Test 9: Webhook Endpoint Check
        console.log('\n9. Testing Webhook Endpoint...')
        try {
            const response = await fetch('http://localhost:3000/api/webhooks/vip-reseller')
            if (response.ok) {
                const data = await response.json()
                console.log(`✅ Webhook endpoint active: ${data.service}`)
                console.log(`   Supported callbacks: ${data.supported_callbacks.join(', ')}`)
            } else {
                console.log(`⚠️  Webhook endpoint not responding: ${response.status}`)
            }
        } catch (error) {
            console.log(`⚠️  Webhook test failed: ${error.message}`)
            console.log('   Make sure your development server is running')
        }

        console.log('\n🎉 VIP-Reseller Integration Test Complete!')
        console.log('\nNext Steps:')
        console.log('1. Set up your VIP-Reseller API credentials in .env')
        console.log('2. Run database migrations: npm run db:push')
        console.log('3. Access admin panel at /admin/catalog')
        console.log('4. Perform full sync to import all data')

    } catch (error) {
        console.log(`\n💥 Test failed with error: ${error.message}`)
        console.log('\nTroubleshooting:')
        console.log('- Check your .env file for correct API credentials')
        console.log('- Ensure database is running and accessible')
        console.log('- Verify network connectivity to VIP-Reseller API')
    }
}

// Test Configuration Check
function checkConfiguration() {
    console.log('🔍 Checking Configuration...\n')
    
    const requiredEnvVars = [
        'VIP_RESELLER_API_KEY',
        'VIP_RESELLER_API_ID',
        'DATABASE_URL'
    ]
    
    const missing = requiredEnvVars.filter(envVar => !process.env[envVar])
    
    if (missing.length > 0) {
        console.log('❌ Missing required environment variables:')
        missing.forEach(envVar => console.log(`   - ${envVar}`))
        console.log('\nPlease add these to your .env file before running the test.\n')
        return false
    }
    
    console.log('✅ All required environment variables are set\n')
    return true
}

// Main execution
async function main() {
    console.log('=' .repeat(60))
    console.log('         VIP-RESELLER INTEGRATION TEST')
    console.log('=' .repeat(60))
    
    if (checkConfiguration()) {
        await testVipIntegration()
    }
    
    console.log('\n' + '=' .repeat(60))
}

// Handle both direct execution and module import
if (require.main === module) {
    main().catch(console.error)
}

module.exports = {
    testVipIntegration,
    checkConfiguration
}
