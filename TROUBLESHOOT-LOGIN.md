# 🔧 Troubleshooting: Button Login Tidak Muncul di Production

Panduan lengkap untuk mengatasi masalah button login yang tidak muncul di production pada topbar WMX Topup.

## 🎯 Gejala Masalah

- Button "Login" tidak muncul di production
- Navbar menampilkan loading state terus-menerus
- Session tidak ter-load dengan benar
- Hydration mismatch antara server dan client

## 🔍 Diagnosis Masalah

### 1. Jalankan Environment Validation

```bash
# Validasi environment variables
npm run check-env

# Atau langsung
node check-env.js
```

### 2. Periksa Browser Console

Buka Developer Tools → Console dan cari error:
- NextAuth errors
- Hydration warnings
- Network failures
- JavaScript errors

### 3. Aktifkan Session Debug (Sementara)

Tambahkan komponen debug ke layout untuk production:

```tsx
import { SessionDebug } from '@/components/debug/session-debug'

// Di dalam component
{process.env.NODE_ENV === 'production' && <SessionDebug />}
```

## ⚙️ Solusi yang Telah Diimplementasikan

### 1. ✅ Fix Hydration Mismatch

**Masalah**: Server-side rendering berbeda dengan client-side, menyebabkan button hilang.

**Solusi**: Menambahkan `isClient` state di `navbar.tsx`:

```tsx
const [isClient, setIsClient] = React.useState(false)

React.useEffect(() => {
  setIsClient(true)
}, [])

// Conditional rendering
{!isClient ? (
  <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
) : status === 'loading' ? (
  <div className="w-16 h-8 bg-white/10 rounded animate-pulse" />
) : session?.user ? (
  // User menu
) : (
  // Login button
)}
```

### 2. ✅ Environment Variables Validation

**Masalah**: Environment variables tidak terkonfigurasi dengan benar.

**Solusi**: Script validasi otomatis `check-env.js` yang berjalan sebelum build.

### 3. ✅ Debug Logging

**Masalah**: Sulit mendiagnosis masalah di production.

**Solusi**: Menambahkan logging di navbar untuk tracking session state.

## 🛠️ Checklist Production Deployment

### Environment Variables Wajib

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/wmx_topup"

# NextAuth - CRITICAL untuk login!
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="random-32-character-secret-string"

# VIP Reseller API
VIP_RESELLER_API_URL="https://vip-reseller.co.id/api"
VIP_RESELLER_API_KEY="your_api_key"
VIP_RESELLER_API_ID="your_api_id"

# Midtrans
MIDTRANS_SERVER_KEY="your_server_key"
MIDTRANS_CLIENT_KEY="your_client_key"
MIDTRANS_IS_PRODUCTION="true"

# Optional but recommended
NODE_ENV="production"
```

### Validasi Pre-Deploy

1. **Environment Check**:
   ```bash
   npm run check-env
   ```

2. **Build Test**:
   ```bash
   npm run build
   ```

3. **Database Migration**:
   ```bash
   npm run db:push
   ```

## 🐛 Debugging Steps

### 1. Manual Environment Check

```bash
# Check critical NextAuth variables
echo $NEXTAUTH_URL
echo $NEXTAUTH_SECRET

# Verify database connection
echo $DATABASE_URL
```

### 2. Test NextAuth API Endpoint

```bash
# Test NextAuth API
curl https://yourdomain.com/api/auth/providers

# Should return providers configuration
```

### 3. Network Tab Analysis

1. Buka Developer Tools → Network
2. Reload halaman
3. Cari request ke `/api/auth/session`
4. Periksa response status dan data

### 4. Server Logs

Check server/deployment platform logs untuk:
- NextAuth initialization errors
- Database connection failures
- Environment variable warnings

## 🎯 Common Fixes

### Fix 1: NEXTAUTH_URL Mismatch

```bash
# Production NEXTAUTH_URL HARUS sesuai dengan domain
NEXTAUTH_URL="https://yourdomain.com"  # ✅ Correct
NEXTAUTH_URL="http://localhost:3000"   # ❌ Wrong for production
```

### Fix 2: NEXTAUTH_SECRET Missing/Weak

```bash
# Generate strong secret
openssl rand -base64 32

# Or use online generator
# Set as NEXTAUTH_SECRET
```

### Fix 3: Database Connection Issues

```bash
# Test database connection
npx prisma db push
npx prisma generate
```

### Fix 4: HTTPS/SSL Issues

Pastikan:
- Domain menggunakan HTTPS di production
- SSL certificate valid
- No mixed content warnings

## 🚀 Quick Deploy Checklist

- [ ] Run `npm run check-env`
- [ ] Verify `NEXTAUTH_URL` matches production domain
- [ ] Confirm `NEXTAUTH_SECRET` is set and strong (32+ chars)
- [ ] Database is accessible and migrated
- [ ] Build completes without errors
- [ ] Test login flow in staging first

## 📞 Emergency Debug Mode

Jika masih bermasalah, aktifkan debug mode sementara:

```tsx
// Di app/layout.tsx - HANYA UNTUK DEBUG!
import { SessionDebug } from '@/components/debug/session-debug'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          {/* Aktifkan hanya untuk debug production */}
          <SessionDebug show={true} />
        </Providers>
      </body>
    </html>
  )
}
```

**PENTING**: Hapus SessionDebug setelah debugging selesai!

## 📈 Monitoring Production

Setup monitoring untuk:
- Failed authentication attempts
- Session creation/validation errors
- Environment variable changes
- Database connectivity issues

## 🆘 Jika Masih Bermasalah

1. Periksa platform deployment logs
2. Verify DNS dan SSL configuration
3. Test dengan browser berbeda/incognito
4. Cek ada ad-blocker/security extension yang interfere
5. Pastikan cookies tidak diblokir

## 📋 Deployment Platforms

### Vercel
```bash
# Set environment variables di Vercel dashboard
# Atau via CLI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
```

### Railway/Render
Set via platform dashboard atau environment files

### Docker
```dockerfile
ENV NEXTAUTH_URL=https://yourdomain.com
ENV NEXTAUTH_SECRET=your-secret-here
```

---

💡 **Pro Tip**: Selalu test authentication flow di staging environment yang mirip production sebelum deploy!
