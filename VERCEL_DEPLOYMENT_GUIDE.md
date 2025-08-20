# 🚀 WMX TOPUP - Vercel Deployment Guide

## 📋 **Overview**
Panduan lengkap untuk deploy WMX TOPUP platform ke Vercel dengan frontend dan backend API dalam satu project.

---

## 🏗️ **Project Structure**
```
wmx-topup/
├── api/                          # Vercel API Routes (Backend)
│   └── vip-reseller-proxy.js    # VIP Reseller API Proxy
├── src/                          # React Frontend
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
├── dist/                         # Build output
├── vercel.json                   # Vercel configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables
```

---

## 🔧 **Pre-Deployment Setup**

### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

### **2. Login to Vercel**
```bash
vercel login
```

### **3. Link Project**
```bash
vercel link
```

---

## 🌍 **Environment Variables Setup**

### **1. Local Environment (.env)**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://eqjzqymnovmznqigjekk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# VIP Reseller API Configuration
VITE_VIP_RESELLER_API_ID=SNwPrlDU
VITE_VIP_RESELLER_API_KEY=tuKlKtHkjnL3e02DihTqOZ1JH3JQLN8KE3rAqYS4epbPzpCWRKSWyUvir1AywpCx
VITE_VIP_RESELLER_PROXY_URL=/api/vip-reseller-proxy

# Production Settings
VITE_APP_ENV=production
```

### **2. Vercel Environment Variables**
Set these in Vercel Dashboard or via CLI:

```bash
# Set Supabase variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Set VIP Reseller variables
vercel env add VITE_VIP_RESELLER_API_ID production
vercel env add VITE_VIP_RESELLER_API_KEY production
vercel env add VITE_VIP_RESELLER_PROXY_URL production

# Set app environment
vercel env add VITE_APP_ENV production
```

**Values to set:**
- `VITE_SUPABASE_URL`: `https://eqjzqymnovmznqigjekk.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `VITE_VIP_RESELLER_API_ID`: `SNwPrlDU`
- `VITE_VIP_RESELLER_API_KEY`: `tuKlKtHkjnL3e02DihTqOZ1JH3JQLN8KE3rAqYS4epbPzpCWRKSWyUvir1AywpCx`
- `VITE_VIP_RESELLER_PROXY_URL`: `/api/vip-reseller-proxy`
- `VITE_APP_ENV`: `production`

---

## 📦 **Deployment Steps**

### **Method 1: Vercel CLI (Recommended)**

1. **Build and Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

2. **Check Deployment**
```bash
vercel ls
vercel inspect [deployment-url]
```

### **Method 2: GitHub Integration**

1. **Push to GitHub**
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

### **Method 3: Vercel Dashboard**

1. **Upload Project**
   - Zip your project folder
   - Upload via Vercel dashboard
   - Configure settings

---

## ⚙️ **Vercel Configuration**

### **vercel.json**
```json
{
  "version": 2,
  "name": "wmx-topup",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "functions": {
    "api/vip-reseller-proxy.js": {
      "maxDuration": 30
    }
  }
}
```

### **Build Settings**
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## 🔌 **API Routes**

### **VIP Reseller Proxy** (`/api/vip-reseller-proxy`)
- **Method**: POST
- **Purpose**: Proxy requests to VIP Reseller API
- **CORS**: Enabled for all origins
- **Timeout**: 30 seconds

**Usage:**
```javascript
const response = await fetch('/api/vip-reseller-proxy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiId: 'your-api-id',
    apiKey: 'your-api-key',
    type: 'services'
  })
});
```

---

## 🧪 **Testing Deployment**

### **1. Local Testing**
```bash
# Build locally
npm run build

# Preview build
npm run serve

# Test API routes
curl -X POST http://localhost:4173/api/vip-reseller-proxy \
  -H "Content-Type: application/json" \
  -d '{"apiId":"test","apiKey":"test","type":"services"}'
```

### **2. Production Testing**
```bash
# Test deployed API
curl -X POST https://your-app.vercel.app/api/vip-reseller-proxy \
  -H "Content-Type: application/json" \
  -d '{"apiId":"SNwPrlDU","apiKey":"tuKlKtHkjnL3e02DihTqOZ1JH3JQLN8KE3rAqYS4epbPzpCWRKSWyUvir1AywpCx","type":"services"}'
```

### **3. Frontend Testing**
- Visit: `https://your-app.vercel.app`
- Test: `/vip-reseller-test` page
- Verify: All API calls work without CORS errors

---

## 📊 **Monitoring & Logs**

### **Vercel Dashboard**
- **Functions**: Monitor API route performance
- **Analytics**: Track usage and performance
- **Logs**: Debug API issues

### **Log Access**
```bash
# View function logs
vercel logs [deployment-url]

# Real-time logs
vercel logs --follow
```

---

## 🔒 **Security Considerations**

### **Environment Variables**
- ✅ All sensitive data in environment variables
- ✅ No credentials in source code
- ✅ Separate development/production configs

### **API Security**
- ✅ CORS properly configured
- ✅ Input validation on API routes
- ✅ Error handling without exposing internals

### **Supabase Security**
- ✅ Row Level Security (RLS) enabled
- ✅ Anon key used (not service key)
- ✅ Proper authentication flow

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
```bash
# Check build logs
vercel logs [deployment-url]

# Local build test
npm run build
```

2. **Environment Variables Not Working**
```bash
# List current env vars
vercel env ls

# Pull env vars locally
vercel env pull .env.local
```

3. **API Route Errors**
```bash
# Check function logs
vercel logs --follow

# Test API locally
vercel dev
```

4. **CORS Issues**
- Check API route CORS headers
- Verify proxy URL configuration
- Test with browser dev tools

### **Debug Commands**
```bash
# Check deployment status
vercel ls

# Inspect specific deployment
vercel inspect [deployment-url]

# View build logs
vercel logs [deployment-url] --since 1h

# Test locally with production env
vercel dev
```

---

## 📈 **Performance Optimization**

### **Build Optimization**
- ✅ Source maps enabled for debugging
- ✅ Code splitting with Vite
- ✅ Asset optimization

### **API Optimization**
- ✅ 30-second timeout for API routes
- ✅ Efficient error handling
- ✅ Request/response logging

### **Caching**
- ✅ Static assets cached by Vercel CDN
- ✅ API responses can be cached if needed

---

## 🎯 **Deployment Checklist**

### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] API routes tested locally (`vercel dev`)
- [ ] Database migrations completed
- [ ] VIP Reseller credentials verified

### **Deployment**
- [ ] Deploy to preview first (`vercel`)
- [ ] Test all functionality on preview
- [ ] Deploy to production (`vercel --prod`)
- [ ] Verify production deployment

### **Post-Deployment**
- [ ] Test complete user flow
- [ ] Verify VIP Reseller API integration
- [ ] Check Supabase connection
- [ ] Monitor logs for errors
- [ ] Set up domain (if needed)

---

## 🌐 **Custom Domain Setup**

### **Add Domain**
```bash
# Add custom domain
vercel domains add yourdomain.com

# List domains
vercel domains ls

# Verify domain
vercel domains verify yourdomain.com
```

### **DNS Configuration**
- **Type**: CNAME
- **Name**: www (or @)
- **Value**: cname.vercel-dns.com

---

## 📞 **Support Resources**

### **Vercel Documentation**
- [Vercel Docs](https://vercel.com/docs)
- [API Routes](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

### **Project Resources**
- **Repository**: Your GitHub repository
- **Issues**: GitHub Issues for bug reports
- **Documentation**: This deployment guide

---

## ✅ **Success Criteria**

**Deployment is successful when:**
- ✅ Frontend loads without errors
- ✅ VIP Reseller API proxy works
- ✅ Supabase integration functional
- ✅ User authentication works
- ✅ Game top-up flow completes
- ✅ All environment variables configured
- ✅ No CORS errors in production

---

**🎉 Ready to deploy WMX TOPUP to Vercel!**

**Quick Deploy Command:**
```bash
vercel --prod
```