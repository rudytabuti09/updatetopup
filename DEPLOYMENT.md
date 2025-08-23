# 🚀 Production Deployment Guide - WMX Topup

Complete guide untuk deploy WMX Topup ke production dengan button login yang berfungsi dengan benar.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables Validation
```bash
# Validasi semua environment variables
npm run check-env
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema ke production database
npm run db:push

# (Optional) Seed data initial
npm run db:seed
```

### 3. Build Test
```bash
# Test build production
npm run build

# Test start
npm start
```

## 🔧 Environment Configuration

### Critical Environment Variables untuk Login

```env
# NextAuth - WAJIB untuk button login muncul!
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="strong-32-character-secret-here"

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Midtrans Keys (update dengan production keys)
MIDTRANS_SERVER_KEY="Mid-server-production-key"
MIDTRANS_CLIENT_KEY="Mid-client-production-key"
MIDTRANS_IS_PRODUCTION=true

# Production settings
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET
```bash
# Method 1: OpenSSL
openssl rand -base64 32

# Method 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🌐 Platform Deployment

### Vercel Deployment

1. **Setup Environment Variables**
```bash
# Via Vercel CLI
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
vercel env add DATABASE_URL
vercel env add MIDTRANS_SERVER_KEY
vercel env add MIDTRANS_CLIENT_KEY
vercel env add VIP_RESELLER_API_KEY
```

2. **Deploy**
```bash
vercel deploy --prod
```

3. **Vercel Environment Settings**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required variables
   - Set `NEXTAUTH_URL` to your production domain

### Railway Deployment

1. **Create Project**
```bash
railway login
railway init
```

2. **Set Environment Variables**
```bash
railway variables set NEXTAUTH_URL=https://yourdomain.com
railway variables set NEXTAUTH_SECRET=your-secret
# Add all other variables...
```

3. **Deploy**
```bash
railway up
```

### Render Deployment

1. **Create Web Service** di Render Dashboard
2. **Build Command**: `npm run build`
3. **Start Command**: `npm start`
4. **Environment Variables**: Add via dashboard
5. **Custom Domain**: Set NEXTAUTH_URL sesuai domain

### Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

ENV NODE_ENV=production
CMD ["npm", "start"]
```

2. **Docker Compose**
```yaml
version: '3.8'
services:
  wmx-topup:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXTAUTH_URL=https://yourdomain.com
      - NEXTAUTH_SECRET=your-secret
      - DATABASE_URL=postgresql://...
    depends_on:
      - postgres
  
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: wmx_topup
      POSTGRES_USER: wmx
      POSTGRES_PASSWORD: your-password
```

## 🔍 Post-Deployment Testing

### 1. Health Check
```bash
# Test API endpoints
curl https://yourdomain.com/api/auth/providers
curl https://yourdomain.com/api/auth/session
```

### 2. Login Flow Test
1. Buka https://yourdomain.com
2. Pastikan button "Login" muncul di topbar
3. Klik button login
4. Test signup/signin process
5. Verify session persistence

### 3. Debug Tools
```tsx
// Tambahkan SessionDebug untuk troubleshooting
import { SessionDebug } from '@/components/debug/session-debug'

// Di layout atau page
{process.env.NODE_ENV === 'production' && <SessionDebug />}
```

## 🐛 Common Production Issues

### Button Login Tidak Muncul
1. **Check NEXTAUTH_URL**: Harus sesuai production domain
2. **Verify NEXTAUTH_SECRET**: Minimal 32 karakter
3. **HTTPS Required**: Production harus menggunakan HTTPS
4. **Check Console**: Lihat error di browser console

### Session Issues
1. **Cookie Domain**: Pastikan cookies tidak diblokir
2. **HTTPS Only**: NextAuth memerlukan HTTPS di production
3. **Database Connection**: Verify database accessible

### API Errors
1. **CORS Issues**: Check domain configuration
2. **Environment Variables**: Verify all variables loaded
3. **Database Migration**: Ensure schema up-to-date

## 📊 Monitoring & Logging

### Setup Monitoring
```javascript
// lib/monitoring.js
export function logAuthEvent(event, data) {
  if (process.env.NODE_ENV === 'production') {
    console.log(`AUTH_${event}:`, {
      timestamp: new Date().toISOString(),
      ...data
    })
  }
}

// Usage dalam components
logAuthEvent('LOGIN_ATTEMPT', { userId, email })
logAuthEvent('SESSION_ERROR', { error })
```

### Error Tracking
- Setup Sentry atau similar service
- Monitor authentication failures
- Track API response times
- Alert pada high error rates

## 🔒 Security Considerations

### Production Security
1. **Strong NEXTAUTH_SECRET** (32+ chars, random)
2. **HTTPS Enforced** untuk semua routes
3. **Database SSL** enabled
4. **API Rate Limiting** enabled
5. **CORS** properly configured

### Environment Security
- Never commit `.env` files
- Use platform-specific secret management
- Rotate secrets regularly
- Audit access permissions

## 🚀 Performance Optimization

### Production Optimizations
1. **Enable Gzip** compression
2. **CDN** untuk static assets
3. **Database Connection Pooling**
4. **Redis** untuk session storage (optional)
5. **Image Optimization** enabled

### Caching Strategy
```javascript
// next.config.js
module.exports = {
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ['your-domain.com'],
  },
  // Enable static optimization
  trailingSlash: false,
}
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrated and accessible
- [ ] `npm run check-env` passes
- [ ] `npm run build` successful
- [ ] NEXTAUTH_URL matches production domain
- [ ] NEXTAUTH_SECRET is strong (32+ chars)
- [ ] HTTPS enabled dan valid SSL
- [ ] Button login muncul di topbar
- [ ] Authentication flow berfungsi
- [ ] API endpoints accessible
- [ ] Error monitoring setup
- [ ] Performance monitoring active

## 🆘 Emergency Rollback

### Quick Rollback Steps
1. **Revert Environment Variables** ke versi working
2. **Rollback Database** jika ada breaking changes
3. **Deploy Previous Version** dari git history
4. **Clear CDN Cache** jika menggunakan CDN
5. **Verify Login Functionality** setelah rollback

### Rollback Commands
```bash
# Git rollback
git log --oneline -n 5
git reset --hard <commit-hash>

# Vercel rollback
vercel --prod --force

# Railway rollback
railway rollback
```

---

💡 **Pro Tips:**
- Selalu test di staging environment dulu
- Monitor logs setelah deployment
- Setup alerts untuk authentication failures
- Keep backup of working environment configuration
