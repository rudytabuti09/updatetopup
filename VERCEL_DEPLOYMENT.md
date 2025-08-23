# Vercel Deployment Guide untuk WMX Topup

Panduan lengkap deploy aplikasi WMX Topup ke Vercel dengan integrasi VIP-Reseller.

## 🌐 VIP-Reseller IP Whitelist

### ❓ **Apakah Perlu Whitelist IP?**

**JAWABAN: TIDAK perlu whitelist IP untuk VIP-Reseller.**

VIP-Reseller API menggunakan **API Key authentication** bukan IP-based authentication. Yang diperlukan adalah:
- ✅ **API_KEY** yang valid
- ✅ **API_ID** yang valid  
- ✅ **Signature MD5** yang correct
- ❌ **TIDAK** perlu whitelist IP

### 🔐 **VIP-Reseller Authentication**
```bash
# Yang dibutuhkan:
VIP_RESELLER_API_KEY=your_api_key_here
VIP_RESELLER_API_ID=your_api_id_here

# Formula signature: MD5(API_ID + API_KEY)
# Sudah dihandle otomatis di kode
```

## 🚀 Persiapan Deployment ke Vercel

### 1. **Database Migration**

Karena Vercel tidak support SQLite untuk production, kita perlu migrasi ke PostgreSQL:

#### Setup PostgreSQL (Recommended: Supabase atau Neon)

**Opsi A: Supabase (Free tier)**
1. Daftar di [Supabase](https://supabase.com)
2. Create new project
3. Copy database URL

**Opsi B: Neon (Free tier)**
1. Daftar di [Neon](https://neon.tech)  
2. Create database
3. Copy connection string

**Opsi C: Railway (Paid but reliable)**
1. Daftar di [Railway](https://railway.app)
2. Deploy PostgreSQL
3. Copy database URL

### 2. **Update Database Configuration**

Update `.env.production`:
```env
# Production Database (ganti dengan URL database Anda)
DATABASE_URL="postgresql://username:password@host:5432/database"

# VIP-Reseller API (production credentials)
VIP_RESELLER_API_URL="https://vip-reseller.co.id/api"
VIP_RESELLER_API_KEY="your_production_api_key"
VIP_RESELLER_API_ID="your_production_api_id"

# Midtrans (production mode)
MIDTRANS_SERVER_KEY="your_production_server_key"
MIDTRANS_CLIENT_KEY="your_production_client_key"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your_production_client_key"
MIDTRANS_IS_PRODUCTION=true

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your_production_secret_key"

# Application
APP_NAME="WMX TOPUP"
APP_URL="https://your-domain.vercel.app"
APP_DESCRIPTION="Layanan Top Up Game, Pulsa, E-Money, dan PPOB Terpercaya"
```

### 3. **Update Prisma untuk PostgreSQL**

Edit `prisma/schema.prisma`:
```prisma
// Ganti dari SQLite ke PostgreSQL
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

## 📦 Deployment Steps

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Setup Database Migration
```bash
# Install PostgreSQL adapter
npm install pg @types/pg

# Generate Prisma client untuk PostgreSQL
npx prisma generate

# Deploy database schema ke production
npx prisma db push --force-reset
```

### Step 3: Deploy ke Vercel
```bash
# Login ke Vercel
vercel login

# Deploy project
vercel

# Set environment variables
vercel env add DATABASE_URL production
vercel env add VIP_RESELLER_API_KEY production  
vercel env add VIP_RESELLER_API_ID production
vercel env add NEXTAUTH_SECRET production
# ... add all other env vars
```

### Step 4: Deploy Production
```bash
# Deploy to production
vercel --prod
```

## ⚙️ Environment Variables di Vercel

Masuk ke **Vercel Dashboard** → **Project** → **Settings** → **Environment Variables**

Add semua environment variables berikut:

### Required Variables:
```bash
DATABASE_URL=postgresql://...
VIP_RESELLER_API_URL=https://vip-reseller.co.id/api
VIP_RESELLER_API_KEY=your_key
VIP_RESELLER_API_ID=your_id
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret
MIDTRANS_SERVER_KEY=your_key
MIDTRANS_CLIENT_KEY=your_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_key
MIDTRANS_IS_PRODUCTION=true
```

## 🔧 Post-Deployment Setup

### 1. **Database Seeding**
Setelah deploy, seed database dengan admin user:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma db seed
```

Atau buat API endpoint untuk seeding:
```typescript
// app/api/admin/seed/route.ts
export async function POST() {
  // Create admin user and initial data
}
```

### 2. **Test VIP-Reseller Connection**

Buat endpoint test connectivity:

```typescript
// app/api/test/vip-connection/route.ts
import { vipResellerAPI } from '@/lib/vip-reseller'

export async function GET() {
  try {
    const services = await vipResellerAPI.getServices()
    return Response.json({
      success: true,
      message: `Connected! Found ${services.length} services`
    })
  } catch (error) {
    return Response.json({
      success: false,
      message: error.message
    }, { status: 500 })
  }
}
```

Test via: `https://your-domain.vercel.app/api/test/vip-connection`

### 3. **Setup Cron Jobs (Optional)**

Untuk auto-sync stock secara berkala:

```typescript
// app/api/cron/sync-stock/route.ts
import { vipSyncService } from '@/lib/services/vip-sync'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const result = await vipSyncService.syncStock()
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. **VIP-Reseller API Connection Failed**
**Check:**
- ✅ API_KEY dan API_ID benar
- ✅ Environment variables ter-set di Vercel
- ✅ No IP whitelist needed for VIP-Reseller

#### 2. **Database Connection Error**
**Solutions:**
- Pastikan DATABASE_URL format correct
- Test database connectivity
- Check firewall settings (untuk self-hosted DB)

#### 3. **Prisma Generate Error**
**Solutions:**
```bash
# Regenerate Prisma client
npx prisma generate
vercel --prod
```

#### 4. **NextAuth Session Issues**
**Check:**
- NEXTAUTH_URL matches production domain
- NEXTAUTH_SECRET is set and unique

## 🌟 Production Checklist

### Before Deploy:
- [ ] Database setup (PostgreSQL)
- [ ] All environment variables configured
- [ ] Prisma schema updated untuk PostgreSQL
- [ ] VIP-Reseller credentials production-ready
- [ ] Midtrans production mode enabled

### After Deploy:
- [ ] Test VIP-Reseller API connection
- [ ] Seed database dengan admin user
- [ ] Test auth flow (login/logout)
- [ ] Test product management
- [ ] Test order flow
- [ ] Monitor error logs

### Performance:
- [ ] Enable edge functions di Vercel
- [ ] Setup CDN untuk static assets
- [ ] Configure caching headers
- [ ] Monitor API response times

## 📊 Monitoring

### Vercel Analytics:
- Enable Web Analytics
- Monitor function execution times
- Track API errors

### Custom Monitoring:
```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await testDatabaseConnection(),
    vipReseller: await testVipResellerConnection(),
    timestamp: new Date().toISOString()
  }
  
  return Response.json(checks)
}
```

## 💡 Pro Tips

### 1. **Regional Optimization**
```json
// vercel.json
{
  "regions": ["sin1", "hnd1"],  // Singapore + Tokyo untuk Asia
  "functions": {
    "app/api/admin/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. **Auto-Deploy**
Setup GitHub integration untuk auto-deploy:
- Connect repository di Vercel dashboard  
- Enable auto-deploy on push
- Setup preview deployments

### 3. **Domain Setup**
```bash
# Add custom domain
vercel domains add yourdomain.com
```

---

## 🎯 Summary

### **VIP-Reseller Whitelist: TIDAK PERLU**
- VIP-Reseller menggunakan API Key authentication
- Tidak ada requirement untuk IP whitelist
- Yang penting: API_KEY dan API_ID valid

### **Deployment Ready:**
- ✅ Vercel configuration (vercel.json)
- ✅ PostgreSQL migration guide
- ✅ Environment variables setup
- ✅ Production checklist
- ✅ Troubleshooting guide

**Deploy sekarang dengan confidence!** 🚀

Aplikasi Anda siap di-deploy ke Vercel tanpa perlu khawatir tentang IP whitelist untuk VIP-Reseller.
