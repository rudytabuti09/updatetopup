#!/usr/bin/env node

/**
 * Environment Variables Validation Script for WMX Topup
 * Run this script to validate all required environment variables for production
 */

// Load environment variables from .env file
require('dotenv').config()

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'VIP_RESELLER_API_URL',
  'VIP_RESELLER_API_KEY',
  'VIP_RESELLER_API_ID',
  'MIDTRANS_SERVER_KEY',
  'MIDTRANS_CLIENT_KEY',
  'MIDTRANS_IS_PRODUCTION'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT'
];

console.log('🔍 Checking environment variables...\n');

let hasErrors = false;

// Check required variables
console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (!value || value.trim() === '') {
    console.log(`❌ ${envVar}: MISSING or EMPTY`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    const isSensitive = envVar.includes('SECRET') || envVar.includes('KEY') || envVar.includes('PASSWORD');
    const displayValue = isSensitive ? '*'.repeat(8) + value.slice(-4) : value;
    console.log(`✅ ${envVar}: ${displayValue}`);
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`✅ ${envVar}: ${value}`);
  } else {
    console.log(`⚠️  ${envVar}: NOT SET (optional)`);
  }
});

// Specific validation for NextAuth
console.log('\n🔐 NextAuth Configuration Check:');

const nextauthUrl = process.env.NEXTAUTH_URL;
if (nextauthUrl) {
  try {
    const url = new URL(nextauthUrl);
    console.log(`✅ NEXTAUTH_URL format is valid: ${url.origin}`);
    
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
      console.log('⚠️  WARNING: Production environment should use HTTPS');
    }
  } catch (error) {
    console.log(`❌ NEXTAUTH_URL format is invalid: ${nextauthUrl}`);
    hasErrors = true;
  }
}

const nextauthSecret = process.env.NEXTAUTH_SECRET;
if (nextauthSecret) {
  if (nextauthSecret.length < 32) {
    console.log('⚠️  WARNING: NEXTAUTH_SECRET should be at least 32 characters long');
  } else {
    console.log('✅ NEXTAUTH_SECRET length is adequate');
  }
}

// Database check
console.log('\n🗄️  Database Configuration Check:');
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  try {
    const url = new URL(dbUrl);
    console.log(`✅ Database URL format is valid: ${url.protocol}//${url.host}${url.pathname}`);
  } catch (error) {
    console.log(`❌ DATABASE_URL format is invalid`);
    hasErrors = true;
  }
}

// Midtrans check
console.log('\n💳 Midtrans Configuration Check:');
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
console.log(`ℹ️  Midtrans Environment: ${isProduction ? 'PRODUCTION' : 'SANDBOX'}`);

if (hasErrors) {
  console.log('\n❌ Environment validation failed! Please fix the issues above before deploying to production.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are configured correctly!');
  console.log('\n🚀 Your application should work properly in production.');
}

console.log('\n💡 Tips for production deployment:');
console.log('   1. Make sure NEXTAUTH_URL matches your production domain');
console.log('   2. Use a strong, randomly generated NEXTAUTH_SECRET');
console.log('   3. Set NODE_ENV=production');
console.log('   4. Verify database connectivity');
console.log('   5. Test authentication flow after deployment');
