# 🔧 Fix Vercel Deployment Issues

## Masalah yang Terdeteksi:

1. **ERR_CONNECTION_CLOSED** pada `/api/auth/session`
2. **CLIENT_FETCH_ERROR** dari NextAuth
3. **404 errors** untuk `/faq` dan `/about` (sudah diperbaiki di code)
4. **Session tidak berjalan** - NextAuth tidak bisa fetch session

## Root Cause:
Environment variables di Vercel mungkin tidak ter-load dengan benar atau ada masalah dengan build.

## Solusi Step-by-Step:

### 1. Verifikasi Environment Variables di Vercel Dashboard

Masuk ke **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

Pastikan SEMUA variables ini ada untuk **Production** environment:

```bash
# NextAuth (CRITICAL!)
NEXTAUTH_URL=https://topup.wmxservices.store
NEXTAUTH_SECRET=[generate dengan: openssl rand -base64 32]

# Database
DATABASE_URL=postgresql://neondb_owner:npg_oRQVYvg4U8xD@ep-quiet-truth-adkqd5g9-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# VIP Reseller
VIP_RESELLER_API_URL=https://vip-reseller.co.id/api
VIP_RESELLER_API_KEY=8yvQFoXJEmm5GN42ELNT8sJU47HPjRiPk3xJxeCQh2TRvZlOabYKFnqQBr93s5
VIP_RESELLER_API_ID=SNwPrlDU

# Midtrans
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
MIDTRANS_IS_PRODUCTION=false
```

### 2. Clear Cache dan Redeploy

Di Vercel Dashboard:
1. Go to **Deployments** tab
2. Click menu (3 dots) on latest deployment
3. Select **Redeploy**
4. Check **"Use existing Build Cache"** - UNCHECK ini!
5. Click **Redeploy**

### 3. Jika Masih Error, Force Rebuild:

Via terminal:
```bash
# Install Vercel CLI jika belum
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Force rebuild tanpa cache
vercel --prod --force
```

### 4. Verifikasi Deployment

Setelah deployment selesai, test endpoints:

1. **Check environment**: https://topup.wmxservices.store/api/debug/auth
2. **Check session**: https://topup.wmxservices.store/api/auth/session
3. **Check providers**: https://topup.wmxservices.store/api/auth/providers

### 5. Jika NextAuth Masih Error

Add environment variable ini di Vercel:

```bash
# Tambahan untuk debugging
NODE_ENV=production
VERCEL=1
VERCEL_ENV=production

# Jika menggunakan custom domain
VERCEL_URL=topup.wmxservices.store
```

### 6. Alternative: Gunakan Vercel Environment Files

Buat file `.env.production.local`:
```bash
NEXTAUTH_URL=https://topup.wmxservices.store
NEXTAUTH_SECRET=your_generated_secret_here
```

Push ke Git dan redeploy.

### 7. Debug via Vercel Functions Log

1. Go to Vercel Dashboard
2. Click **Functions** tab
3. Check logs for `/api/auth/[...nextauth]`
4. Look for error messages

### 8. Common Fixes:

**If "NEXTAUTH_URL mismatch":**
- Pastikan tidak ada trailing slash
- Gunakan https://, bukan http://
- Match exactly dengan domain akses

**If "Database connection failed":**
- Check DATABASE_URL format
- Test connection dari local dengan URL yang sama
- Pastikan SSL mode sesuai

**If "Session undefined":**
- Clear browser cookies
- Check NEXTAUTH_SECRET sama di semua environment
- Restart browser

## Testing Checklist:

- [ ] Environment variables set di Vercel Dashboard
- [ ] NEXTAUTH_URL matches production domain exactly
- [ ] NEXTAUTH_SECRET is set (32+ chars)
- [ ] Database connection works
- [ ] Redeployed without cache
- [ ] `/api/auth/session` returns 200
- [ ] Login button appears
- [ ] Can login successfully

## Emergency Fix:

Jika semua gagal, temporary workaround:

1. Set environment variables via Vercel CLI:
```bash
vercel env add NEXTAUTH_URL production
# Input: https://topup.wmxservices.store

vercel env add NEXTAUTH_SECRET production  
# Input: [your secret]

# Redeploy
vercel --prod --force
```

2. Monitor logs:
```bash
vercel logs --follow
```

## Contact Points:

- Vercel Support: https://vercel.com/support
- NextAuth Discord: https://discord.gg/nextauth
- Database Provider Support (Neon/Supabase)
