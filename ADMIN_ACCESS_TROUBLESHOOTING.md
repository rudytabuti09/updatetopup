# Admin Access Troubleshooting Guide

## 🚨 Masalah: User dengan role admin di database tidak bisa akses admin panel

### 📋 Langkah-langkah Troubleshooting

#### 1. Periksa Status User di Dashboard
1. Login ke aplikasi dengan akun admin
2. Buka halaman `/dashboard`
3. Klik tab "Profil"
4. Scroll ke bawah untuk melihat komponen "Admin Access Test & Debug"
5. Periksa informasi berikut:
   - Email user
   - User ID
   - Profile Loaded: harus ✅
   - Current Role: harus "admin" atau "moderator"
   - Is Verified: sebaiknya ✅

#### 2. Jika Profile Tidak Loaded (❌)
```sql
-- Jalankan query ini di Supabase SQL Editor
-- Ganti 'your-email@example.com' dengan email admin yang bermasalah

SELECT 
    au.id as user_id,
    au.email,
    au.email_confirmed_at,
    p.id as profile_id,
    p.role,
    p.is_verified,
    p.created_at as profile_created
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'your-email@example.com';
```

#### 3. Jika Profile Tidak Ada, Buat Profile Baru
```sql
-- Buat profile untuk user yang sudah ada di auth.users
INSERT INTO profiles (
    id,
    username,
    full_name,
    role,
    is_verified,
    created_at,
    updated_at
)
SELECT 
    au.id,
    'admin',
    'System Administrator',
    'admin'::user_role,
    true,
    NOW(),
    NOW()
FROM auth.users au
WHERE au.email = 'your-email@example.com'
AND NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
);
```

#### 4. Jika Profile Ada tapi Role Salah
```sql
-- Update role user menjadi admin
UPDATE profiles 
SET 
    role = 'admin'::user_role,
    is_verified = true,
    updated_at = NOW()
WHERE id = (
    SELECT id 
    FROM auth.users 
    WHERE email = 'your-email@example.com'
);
```

#### 5. Gunakan Tombol "Make This User Admin" di Dashboard
1. Buka `/dashboard`
2. Klik tab "Profil"
3. Scroll ke komponen "Admin Access Test & Debug"
4. Klik tombol merah "Make This User Admin (TEST)"
5. Klik "Refresh Profile" untuk memuat ulang data
6. Klik "Test Access" untuk memverifikasi

#### 6. Periksa Row Level Security (RLS) Policies
```sql
-- Periksa apakah ada RLS policy yang memblokir akses
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY tablename, policyname;

-- Jika perlu, buat policy untuk admin
CREATE POLICY "Admin can view all profiles" ON profiles
FOR SELECT USING (
    auth.jwt() ->> 'role' = 'admin' OR
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
```

#### 7. Clear Browser Cache dan Cookies
1. Buka Developer Tools (F12)
2. Klik kanan pada refresh button
3. Pilih "Empty Cache and Hard Reload"
4. Atau logout dan login kembali

#### 8. Periksa Console Browser untuk Error
1. Buka Developer Tools (F12)
2. Klik tab "Console"
3. Refresh halaman
4. Cari error yang berkaitan dengan:
   - AuthContext
   - Profile fetching
   - Supabase connection

### 🔧 Debug Tools yang Tersedia

#### AdminDebug Component
Komponen ini muncul di pojok kanan bawah (hanya di development mode) dan menampilkan:
- Status loading
- User data
- Profile data
- Role information

#### AdminAccessTest Component
Tersedia di `/dashboard` → tab "Profil", menyediakan:
- Informasi user lengkap
- Tombol refresh profile
- Tombol test access
- Tombol make admin (untuk testing)
- Raw profile data

### 🚀 Solusi Cepat

#### Opsi 1: Menggunakan SQL Editor Supabase
```sql
-- Script lengkap untuk membuat admin user
-- Ganti email sesuai kebutuhan
DO $$
DECLARE
    user_id UUID;
    user_email TEXT := 'admin@wmxtopup.com'; -- GANTI EMAIL INI
BEGIN
    -- Cari user ID berdasarkan email
    SELECT id INTO user_id FROM auth.users WHERE email = user_email;
    
    IF user_id IS NOT NULL THEN
        -- Update atau insert profile
        INSERT INTO profiles (id, username, full_name, role, is_verified, created_at, updated_at)
        VALUES (user_id, 'admin', 'System Administrator', 'admin'::user_role, true, NOW(), NOW())
        ON CONFLICT (id) 
        DO UPDATE SET 
            role = 'admin'::user_role,
            is_verified = true,
            updated_at = NOW();
            
        RAISE NOTICE 'Admin profile created/updated for user: %', user_email;
    ELSE
        RAISE NOTICE 'User not found with email: %', user_email;
    END IF;
END $$;
```

#### Opsi 2: Menggunakan Dashboard
1. Login dengan akun yang ingin dijadikan admin
2. Buka `/dashboard`
3. Klik tab "Profil"
4. Klik "Make This User Admin (TEST)"
5. Refresh halaman
6. Coba akses `/admin`

### 📝 Checklist Verifikasi

- [ ] User sudah terdaftar di `auth.users`
- [ ] Profile ada di tabel `profiles`
- [ ] Role di profile adalah 'admin' atau 'moderator'
- [ ] `is_verified` adalah `true`
- [ ] Tidak ada RLS policy yang memblokir
- [ ] Browser cache sudah di-clear
- [ ] Tidak ada error di console browser
- [ ] AdminDebug menampilkan data yang benar
- [ ] Test access menunjukkan "PASS ✅"

### 🔍 Debugging Lanjutan

#### Jika masih tidak bisa akses setelah semua langkah:

1. **Periksa AuthContext.jsx**
   - Pastikan `fetchProfile` berjalan dengan benar
   - Periksa apakah ada timeout atau error

2. **Periksa ProtectedRoute.jsx**
   - Pastikan logic role checking benar
   - Periksa apakah `requireAdmin` prop diteruskan dengan benar

3. **Periksa Routes.jsx**
   - Pastikan semua route admin menggunakan `requireAdmin={true}`

4. **Periksa Supabase Connection**
   - Test koneksi ke Supabase
   - Periksa environment variables

### 📞 Bantuan Tambahan

Jika masih mengalami masalah:
1. Buka browser console dan screenshot error yang muncul
2. Jalankan query SQL untuk memeriksa data user
3. Gunakan AdminDebug component untuk melihat data real-time
4. Periksa network tab untuk melihat request/response Supabase

### 🎯 Hasil yang Diharapkan

Setelah troubleshooting berhasil:
- AdminDebug menampilkan "Is Admin: ✅"
- AdminAccessTest menampilkan "Admin Access Test: PASS ✅"
- Tombol "Access Admin Panel" muncul di dashboard
- Link "Admin Panel" muncul di header (untuk admin)
- Bisa mengakses `/admin` tanpa error "Access Denied"

---

**Catatan**: Komponen debug hanya muncul di development mode. Untuk production, hapus atau disable komponen AdminDebug dan AdminAccessTest.