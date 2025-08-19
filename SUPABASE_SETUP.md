# 🚀 Supabase Setup Guide untuk WMX TOPUP

Panduan lengkap untuk menghubungkan project WMX TOPUP dengan Supabase database.

## 📋 Prerequisites

- Akun Supabase (gratis di [supabase.com](https://supabase.com))
- Node.js dan npm sudah terinstall
- Project WMX TOPUP sudah di-clone

## 🛠️ Step 1: Setup Supabase Project

### 1.1 Buat Project Baru di Supabase

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Klik **"New Project"**
3. Pilih organization atau buat baru
4. Isi detail project:
   - **Name**: `wmx-topup` atau nama yang kamu inginkan
   - **Database Password**: Buat password yang kuat (simpan baik-baik!)
   - **Region**: Pilih yang terdekat (Singapore untuk Indonesia)
5. Klik **"Create new project"**
6. Tunggu beberapa menit sampai project selesai dibuat

### 1.2 Dapatkan API Keys

1. Di dashboard project, pergi ke **Settings** → **API**
2. Copy nilai berikut:
   - **Project URL** (contoh: `https://abcdefgh.supabase.co`)
   - **anon public key** (key yang panjang dimulai dengan `eyJ...`)

## 🔧 Step 2: Konfigurasi Environment Variables

### 2.1 Update file .env

Buka file `.env` di root project dan update dengan nilai dari Supabase:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Penting**: Ganti `your-project-id` dan key dengan nilai asli dari Supabase dashboard kamu.

## 🗄️ Step 3: Setup Database Schema

### 3.1 Jalankan Schema SQL

1. Di Supabase dashboard, pergi ke **SQL Editor**
2. Klik **"New query"**
3. Copy seluruh isi file `supabase-schema.sql` dan paste ke editor
4. Klik **"Run"** untuk menjalankan query
5. Pastikan tidak ada error (semua harus berhasil)

### 3.2 Insert Sample Data

1. Buat query baru di SQL Editor
2. Copy seluruh isi file `supabase-sample-data.sql` dan paste
3. Klik **"Run"** untuk insert data sample
4. Verifikasi data berhasil diinsert dengan query:

```sql
SELECT COUNT(*) FROM games;
SELECT COUNT(*) FROM game_packages;
SELECT COUNT(*) FROM promotions;
```

## 🔐 Step 4: Konfigurasi Authentication

### 4.1 Setup Auth Providers

1. Pergi ke **Authentication** → **Settings**
2. Di tab **General**:
   - **Site URL**: `http://localhost:5173` (untuk development)
   - **Redirect URLs**: Tambahkan `http://localhost:5173/**`
3. Di tab **Email**:
   - Enable **"Enable email confirmations"** jika ingin email verification
   - Atau disable untuk development yang lebih mudah

### 4.2 Konfigurasi Email Templates (Opsional)

Jika ingin custom email templates, edit di **Authentication** → **Email Templates**.

## 🚦 Step 5: Test Koneksi

### 5.1 Install Dependencies

Pastikan Supabase client sudah terinstall:

```bash
npm install @supabase/supabase-js
```

### 5.2 Test Koneksi

1. Jalankan development server:

```bash
npm start
```

2. Buka browser ke `http://localhost:5173`
3. Buka Developer Console (F12)
4. Jika setup benar, kamu akan melihat data games dimuat tanpa error

### 5.3 Test Authentication

1. Coba register user baru (jika ada form register)
2. Coba login/logout
3. Check di Supabase dashboard → **Authentication** → **Users** untuk melihat user yang terdaftar

## 📊 Step 6: Verifikasi Data

### 6.1 Check Tables di Dashboard

Pergi ke **Table Editor** dan pastikan tables berikut ada dan berisi data:

- ✅ `games` (8 games)
- ✅ `game_packages` (multiple packages per game)
- ✅ `promotions` (3 promotions)
- ✅ `payment_methods` (10 methods)
- ✅ `system_settings` (11 settings)

### 6.2 Test Queries

Di SQL Editor, test beberapa query:

```sql
-- Test games dengan packages
SELECT g.name, COUNT(gp.id) as package_count 
FROM games g 
LEFT JOIN game_packages gp ON g.id = gp.game_id 
GROUP BY g.id, g.name;

-- Test promotions aktif
SELECT * FROM promotions WHERE is_active = true AND end_date > NOW();

-- Test payment methods
SELECT name, type, fee_percentage FROM payment_methods WHERE is_active = true;
```

## 🔒 Step 7: Row Level Security (RLS)

RLS sudah dikonfigurasi otomatis via schema. Policies yang aktif:

- **Public read** untuk games, packages, promotions, payment methods
- **User-specific access** untuk profiles, transactions, favorites
- **Admin-only access** untuk management tables

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Pastikan `VITE_SUPABASE_ANON_KEY` benar dan tidak ada spasi extra
- Restart development server setelah update .env

### Error: "Failed to fetch"
- Check `VITE_SUPABASE_URL` format harus `https://project-id.supabase.co`
- Pastikan tidak ada trailing slash

### Error: "relation does not exist"
- Jalankan ulang `supabase-schema.sql`
- Pastikan semua tables berhasil dibuat

### Data tidak muncul
- Jalankan `supabase-sample-data.sql`
- Check RLS policies di **Authentication** → **Policies**

### Authentication tidak bekerja
- Check Site URL dan Redirect URLs di Auth settings
- Pastikan email confirmation sesuai kebutuhan

## 📱 Step 8: Production Setup

Untuk production, update environment variables:

```env
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_APP_ENV=production
```

Dan update Auth settings:
- **Site URL**: Domain production kamu
- **Redirect URLs**: `https://yourdomain.com/**`

## 🎯 Next Steps

Setelah setup berhasil, kamu bisa:

1. **Customize data**: Edit games, packages, promotions sesuai kebutuhan
2. **Add features**: Implement transaction processing, payment integration
3. **Optimize**: Add indexes, optimize queries untuk performa
4. **Monitor**: Setup monitoring dan analytics
5. **Scale**: Upgrade Supabase plan sesuai kebutuhan

## 📞 Support

Jika ada masalah:
1. Check [Supabase Documentation](https://supabase.com/docs)
2. Check console errors di browser
3. Verify semua environment variables
4. Test koneksi dengan query sederhana

---

**🎮 Happy Gaming! Semoga WMX TOPUP sukses!** 🚀