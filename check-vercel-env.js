// Vercel Environment Variables Check
console.log('🔍 Checking Vercel Environment Variables...\n')

console.log('📋 Current Environment Variables in Production:')
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`)
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'NOT SET'}`)
console.log(`NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? '✅ SET' : '❌ NOT SET'}`)
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ SET' : '❌ NOT SET'}`)

// Test NextAuth configuration
console.log('\n🔐 NextAuth Configuration Check:')
console.log(`NEXTAUTH_URL matches domain: ${process.env.NEXTAUTH_URL === 'https://topup.wmxservices.store' ? '✅' : '❌'}`)

// Check if all required vars are present
const requiredVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET', 
  'DATABASE_URL',
  'VIP_RESELLER_API_KEY',
  'VIP_RESELLER_API_ID',
  'MIDTRANS_SERVER_KEY',
  'MIDTRANS_CLIENT_KEY'
]

console.log('\n📊 Required Variables Status:')
requiredVars.forEach(varName => {
  const isSet = process.env[varName] ? true : false
  console.log(`${varName}: ${isSet ? '✅' : '❌'}`)
})

// Export for API usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    envCheck: requiredVars.reduce((acc, varName) => {
      acc[varName] = !!process.env[varName]
      return acc
    }, {}),
    nextauthUrl: process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV
  }
}
