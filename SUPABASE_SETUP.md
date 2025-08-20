# WMX TOPUP - Complete Supabase Setup Guide

## 🚀 **Setup Database Baru untuk Admin Panel**

Panduan lengkap untuk setup Supabase project baru untuk WMX TOPUP dengan admin panel yang fully functional.

## 📋 **Langkah 1: Buat Supabase Project Baru**

1. **Buka [Supabase Dashboard](https://supabase.com/dashboard)**
2. **Klik "New Project"**
3. **Isi detail project:**
   - Name: `WMX TOPUP`
   - Database Password: (buat password yang kuat)
   - Region: `Southeast Asia (Singapore)` (recommended untuk Indonesia)
4. **Klik "Create new project"**
5. **Tunggu project selesai dibuat** (2-3 menit)

## 📋 **Langkah 2: Jalankan SQL Setup Script**

1. **Buka project Supabase** yang baru dibuat
2. **Pergi ke SQL Editor** (sidebar kiri)
3. **Klik "New Query"**
4. **Copy-paste seluruh isi file** `supabase-complete-setup.sql`
5. **Klik "Run"** (atau Ctrl+Enter)
6. **Tunggu sampai selesai** - akan ada output konfirmasi

### **Expected Output:**
```sql
🎉 WMX TOPUP DATABASE SETUP COMPLETE! 🎉
Your Supabase database is now ready for the admin panel

📋 NEXT STEPS:
1. Register a new user in your app
2. The user will automatically get admin role if email contains "admin" or "tsaga"  
3. Login and access /admin to use the admin panel
4. All sample data is ready for testing

🔧 FEATURES ENABLED:
✅ Complete database structure
✅ Auto-create admin profiles  
✅ Sample games and packages
✅ Payment methods configured
✅ RLS policies for security
✅ Performance indexes
✅ Admin panel functions
✅ Auto-update triggers
```

## 📋 **Langkah 3: Update Environment Variables**

1. **Copy file** `.env.example` ke `.env`
2. **Buka Supabase Dashboard** → Settings → API
3. **Copy credentials** dan update `.env`:

```env
# Ganti dengan credentials Supabase baru Anda
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📋 **Langkah 4: Test Setup**

1. **Restart development server**:
```bash
npm run dev
```

2. **Buka aplikasi** di browser
3. **Register user baru** dengan email yang mengandung "admin" atau "tsaga"
   - Contoh: `admin@wmxtopup.com` atau `tsaga@gmail.com`
4. **Login** dengan user yang baru dibuat
5. **Cek AdminDebug** di pojok kanan bawah - harus menunjukkan:
   - Profile: ✅
   - Profile Role: admin
   - Is Admin: ✅

## 🎯 **Yang Dibuat oleh Script:**

### **📊 Database Structure:**
- ✅ **10 Tables** dengan relationships lengkap
- ✅ **Custom Types** untuk enums (user_role, transaction_status, dll.)
- ✅ **Foreign Key Constraints** untuk data integrity
- ✅ **Indexes** untuk performance optimization

### **🎮 Sample Data:**
- ✅ **6 Popular Games**: Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact, Valorant, COD Mobile
- ✅ **30+ Game Packages** dengan VIP service codes
- ✅ **10 Payment Methods**: QRIS, Bank Transfer, E-wallets, Credit Card, Retail
- ✅ **4 Promotional Campaigns** untuk testing
- ✅ **System Settings** untuk konfigurasi

### **🔧 Admin Panel Functions:**
- ✅ `get_admin_stats()` - Dashboard statistics
- ✅ `get_revenue_data(days)` - Revenue charts
- ✅ `get_top_games_by_revenue(limit)` - Top games analytics
- ✅ `search_users(term, role, limit, offset)` - User search
- ✅ `get_user_profile(uuid)` - Profile fetching

### **🔐 Security Features:**
- ✅ **Row Level Security (RLS)** enabled
- ✅ **Role-based access control**
- ✅ **Admin policies** untuk full access
- ✅ **User policies** untuk own data access
- ✅ **Public policies** untuk games dan payment methods

### **⚡ Auto-Features:**
- ✅ **Auto-create profile** saat user register
- ✅ **Auto-admin role** untuk email dengan "admin" atau "tsaga"
- ✅ **Auto-update timestamps** dengan triggers
- ✅ **Auto-calculate statistics** (spending, transaction count)
- ✅ **Auto-update package counts** untuk games

## 🎯 **Admin Panel Features yang Siap:**

### **📊 Dashboard:**
- Real-time statistics (users, games, revenue, transactions)
- Revenue charts dengan data 30 hari terakhir
- System health monitoring
- Recent transactions display
- Quick actions menu

### **👥 User Management:**
- User list dengan search dan filter
- Role management (customer, admin, moderator)
- User actions (ban, verify, promote/demote)
- Bulk operations
- User statistics dan spending history

### **🎮 Game Management:**
- Game catalog dengan categories
- Package management per game
- VIP Reseller service code mapping
- Game status control (active/inactive, popular)
- Price management dan discounts

### **💰 Transaction Monitoring:**
- Transaction history dengan filter
- Status tracking (pending, processing, completed, failed)
- Payment method analytics
- Revenue reports dan export
- VIP Reseller order tracking

### **⚙️ System Settings:**
- General settings (site name, maintenance mode)
- Payment settings (methods, limits, fees)
- VIP Reseller configuration
- Notification settings
- Security settings

## 🔍 **Troubleshooting:**

### **Jika Script Gagal:**
1. **Cek error message** di SQL Editor
2. **Pastikan project Supabase sudah fully loaded**
3. **Jalankan bagian per bagian** jika ada error
4. **Cek Extensions** sudah enabled

### **Jika Admin Access Tidak Berfungsi:**
1. **Register user baru** dengan email mengandung "admin"
2. **Cek di Table Editor** → profiles → pastikan role = 'admin'
3. **Refresh aplikasi** dan login kembali
4. **Cek AdminDebug** untuk status profile

### **Jika Data Tidak Muncul:**
1. **Cek RLS policies** di Dashboard → Authentication → Policies
2. **Pastikan user sudah login**
3. **Cek browser console** untuk error messages
4. **Test query manual** di SQL Editor

## 🎯 **Expected Results:**

Setelah setup berhasil:

### **Database akan berisi:**
- ✅ **Complete table structure** untuk gaming platform
- ✅ **6 sample games** dengan packages dan VIP codes
- ✅ **10 payment methods** siap pakai
- ✅ **Admin user** dengan full access
- ✅ **Sample transactions** untuk testing

### **Admin Panel akan menampilkan:**
- ✅ **Dashboard** dengan real-time stats
- ✅ **User management** dengan sample data
- ✅ **Game management** dengan VIP mapping
- ✅ **Transaction monitoring** 
- ✅ **Revenue analytics** dengan charts
- ✅ **System settings** fully functional

### **Frontend akan berfungsi:**
- ✅ **Authentication** dengan auto-profile creation
- ✅ **Role-based access** untuk admin panel
- ✅ **Real-time data** dari Supabase
- ✅ **VIP Reseller integration** ready
- ✅ **Payment gateway** integration ready

## 🚀 **Production Ready Features:**

- ✅ **Scalable database design**
- ✅ **Security best practices**
- ✅ **Performance optimizations**
- ✅ **Error handling**
- ✅ **Data validation**
- ✅ **Audit trails**
- ✅ **Backup-friendly structure**

---

**Setup Complete!** 🎉

Your WMX TOPUP platform is now ready with a fully functional admin panel connected to Supabase!