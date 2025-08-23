# Admin Panel - Product Management Guide

Panduan lengkap untuk mengelola produk di admin panel WMX Topup.

## 🚀 Akses Admin Panel

1. **Login sebagai Admin:**
   - Admin: `admin@wmx.local` / `admin123`
   - Atau user dengan role `ADMIN` atau `SUPER_ADMIN`

2. **Navigasi ke Catalog Management:**
   ```
   /admin/catalog
   ```
   - Melalui navbar: Klik nama user → Admin Panel → Catalog

## 📦 Fitur Product Management

### 1. **Menambah Produk Baru**

#### Langkah-langkah:
1. **Klik tombol "Tambah Produk"** (hijau) di header
2. **Isi form product:**

   **Basic Information:**
   - **Category***: Pilih kategori (Game, Pulsa, E-Money, dll)
   - **Service***: Pilih service dalam kategori (otomatis filter)
   - **Product Name***: Nama produk (contoh: "1000 Diamonds")
   - **Description**: Deskripsi opsional
   - **SKU***: Kode unik produk
     - Bisa auto-generate dengan klik tombol "Generate"
   - **Category Tag**: Tag kategori (contoh: "Mobile Legends")

   **Pricing:**
   - **Buy Price***: Harga beli dari supplier (Rupiah)
   - **Sell Price***: Harga jual ke customer (Rupiah)
   - **Profit**: Otomatis terhitung (Sell - Buy)

   **Stock Management:**
   - **Stock Type**: 
     - `Unlimited`: Stok tidak terbatas
     - `Limited`: Stok terbatas dengan jumlah
     - `Out of Stock`: Tidak tersedia
   - **Current Stock**: Jumlah stok (jika Limited)
   - **Min Stock Alert**: Level minimum untuk alert
   - **Max Stock**: Batas maksimum stok

   **Settings:**
   - **Sort Order**: Urutan tampilan (angka kecil = atas)
   - **Active Product**: Checkbox untuk mengaktifkan produk

3. **Klik "Create Product"** untuk menyimpan

#### Validasi:
- ✅ Semua field bertanda (*) wajib diisi
- ✅ Sell Price harus lebih tinggi dari Buy Price
- ✅ SKU harus unik
- ✅ Service harus dipilih dari kategori yang valid

### 2. **Mengedit Produk Existing**

#### Langkah-langkah:
1. **Cari produk** menggunakan search box atau filter
2. **Klik tombol "Edit"** pada produk yang ingin diubah
3. **Form akan terbuka dengan data existing**
4. **Ubah field yang diperlukan**
5. **Klik "Update Product"** untuk menyimpan

#### Yang bisa diubah:
- ✅ Nama produk dan deskripsi
- ✅ Harga beli dan jual
- ✅ SKU (jika tidak conflict)
- ✅ Tipe dan jumlah stok
- ✅ Status aktif/nonaktif
- ✅ Sort order
- ❌ Service tidak bisa diubah (harus buat produk baru)

### 3. **Mengelola Stock**

#### Update Stock Manual:
1. **Klik tombol "Stock"** pada produk
2. **Masukkan jumlah stok baru**
3. **Berikan alasan perubahan** (wajib untuk tracking)
4. **Klik "Update Stock"**

#### Tipe Stock:
- **UNLIMITED**: Tidak ada batasan stok (digital products)
- **LIMITED**: Ada jumlah stok spesifik
- **OUT_OF_STOCK**: Sementara tidak tersedia

#### Stock Alerts:
- Alert otomatis ketika stok ≤ minimum level
- Dashboard menampilkan jumlah produk low stock
- Tab "Stock Alerts" menampilkan daftar lengkap

### 4. **Sync dengan VIP-Reseller**

#### Full Sync:
```
Tab "VIP-Reseller Sync" → Klik "Full Sync"
```
- Import semua services dari VIP-Reseller
- Import semua products dan pricing
- Update stock levels

#### Partial Sync:
- **Sync Services**: Update daftar game/layanan
- **Sync Products**: Update produk dan harga
- **Sync Stock**: Update level stok saja

#### Auto-mapping:
- Services otomatis dibuat dengan kategori
- Products otomatis assign ke service yang sesuai
- Profit dihitung otomatis (15% default margin)

## 🔍 Fitur Pencarian & Filter

### Search:
- **Cari berdasarkan**: Nama produk, SKU, nama service
- **Real-time search**: Filter langsung saat mengetik

### Filter Stock:
- **All Products**: Tampilkan semua
- **Limited Stock**: Hanya produk dengan stok terbatas
- **Unlimited**: Hanya produk unlimited
- **Out of Stock**: Produk yang habis
- **Low Stock**: Produk dengan stok dibawah minimum

### Stats Dashboard:
- **Total Products**: Jumlah total produk
- **Low Stock**: Produk perlu restock
- **Active Products**: Produk yang aktif dijual
- **Average Profit**: Rata-rata keuntungan

## 📊 Stock History & Tracking

### Automatic Tracking:
- ✅ Setiap perubahan stok tercatat
- ✅ Siapa yang mengubah (user ID)
- ✅ Kapan diubah (timestamp)
- ✅ Alasan perubahan
- ✅ Stok sebelum dan sesudah

### History Types:
- **MANUAL_ADJUSTMENT**: Perubahan manual admin
- **ORDER_REDUCTION**: Pengurangan karena order
- **SYNC_UPDATE**: Update dari VIP-Reseller
- **RESTOCK**: Penambahan stok
- **CORRECTION**: Koreksi stok

### View History:
```
GET /api/admin/stock?action=history&productId={id}
```

## 🛡️ Security & Permissions

### Role-based Access:
- **SUPER_ADMIN**: Full access (create, edit, delete)
- **ADMIN**: Create dan edit produk, tidak bisa delete
- **USER**: Tidak ada akses admin

### Validations:
- ✅ SKU uniqueness check
- ✅ Price validation (sell > buy)
- ✅ Service exists validation
- ✅ Proper data types and ranges

### Safe Delete:
- Produk dengan existing orders tidak bisa dihapus
- Rekomendasi: nonaktifkan produk instead of delete
- Only SUPER_ADMIN bisa delete produk

## 🚨 Best Practices

### 1. **SKU Naming Convention:**
```
Pattern: {SERVICE}{PRODUCT}{TIMESTAMP}
Example: MOLLEG1004567
- MOLLEG = Mobile Legends (3 chars)
- 100 = 100 Diamonds (3 chars)  
- 4567 = timestamp (4 digits)
```

### 2. **Pricing Strategy:**
```
Buy Price: Harga dari VIP-Reseller
Sell Price: Buy Price + Margin (15-25%)
Profit: Auto calculated
```

### 3. **Stock Management:**
```
Digital Products: UNLIMITED (diamonds, pulsa)
Physical Products: LIMITED (voucher fisik)
Temporary Issues: OUT_OF_STOCK
```

### 4. **Categories Organization:**
```
Games/
├── Mobile Legends
├── Free Fire
├── PUBG Mobile
└── ...

Pulsa/
├── Telkomsel
├── Indosat
├── XL
└── ...
```

## 📱 API Endpoints

### Product Management:
```bash
# Get products with pagination
GET /api/admin/products?page=1&limit=10&search=diamond

# Create new product
POST /api/admin/products
{
  "serviceId": "service_id",
  "name": "1000 Diamonds",
  "price": 15000,
  "buyPrice": 12000,
  "sku": "MOLLEG1004567"
}

# Update existing product
PUT /api/admin/products
{
  "id": "product_id",
  "name": "Updated name",
  "price": 16000
}

# Delete product (SUPER_ADMIN only)
DELETE /api/admin/products?id=product_id
```

### Stock Management:
```bash
# Update stock
PUT /api/admin/stock
{
  "productId": "product_id",
  "stock": 100,
  "reason": "Manual restock"
}

# Get stock history
GET /api/admin/stock?action=history&productId=product_id

# Get low stock products
GET /api/admin/stock?action=low-stock
```

### Categories & Services:
```bash
# Get categories with services
GET /api/admin/categories?includeServices=true

# Create new category
POST /api/admin/categories
{
  "name": "New Game Category",
  "description": "Description",
  "sortOrder": 10
}
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. "SKU already exists"
**Solution:** 
- Generate new SKU dengan tombol "Generate"
- Atau ubah SKU manually ke yang unik

#### 2. "Service not found"
**Solution:**
- Pastikan service sudah dibuat di kategori
- Lakukan sync services dari VIP-Reseller

#### 3. "Selling price must be higher than buy price"
**Solution:**
- Pastikan harga jual > harga beli
- Cek kembali input harga

#### 4. Stock sync gagal
**Solution:**
- Cek koneksi VIP-Reseller API
- Verifikasi API credentials di .env
- Check console untuk error details

#### 5. Product tidak muncul di catalog
**Solution:**
- Pastikan produk status "Active"
- Cek apakah service parent aktif
- Verifikasi kategori aktif

## 📈 Performance Tips

### 1. **Pagination:**
- Use limit parameter untuk large datasets
- Default limit: 10, max: 100

### 2. **Search Optimization:**
- Search bekerja pada nama, SKU, dan service
- Use specific keywords untuk hasil lebih cepat

### 3. **Bulk Operations:**
- Untuk update banyak produk, gunakan VIP-Reseller sync
- Manual edit untuk perubahan spesifik saja

### 4. **Stock Monitoring:**
- Set minimum stock alerts
- Regular sync dengan VIP-Reseller
- Monitor low stock dashboard daily

## 🎯 Next Steps

Setelah mengelola produk:

1. **Test Order Flow**: Pastikan produk bisa dibeli
2. **Setup Payment**: Konfigurasikan Midtrans
3. **Monitor Performance**: Track sales dan stock
4. **Customer Support**: Siapkan FAQ dan support

---

**Admin Panel sudah siap digunakan untuk mengelola produk!** 🎉

Akses: `/admin/catalog` dengan login admin.
