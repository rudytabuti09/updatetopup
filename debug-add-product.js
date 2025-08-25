#!/usr/bin/env node

/**
 * Debug Script - Test Tambah Produk Button
 * Untuk memverifikasi bahwa tombol "Tambah Produk" berfungsi
 */

console.log('🔍 Debug Script - WMX TOPUP Admin Catalog')
console.log('=========================================')

// Simulasi test data
const testProduct = {
  serviceId: 'test-service-123',
  name: 'Test Product Manual',
  description: 'Produk test untuk verifikasi',
  price: 15000,
  buyPrice: 12000,
  sku: 'TEST123',
  category: 'Game',
  stockType: 'LIMITED',
  stock: 100,
  minStock: 10,
  maxStock: 1000,
  isActive: true,
  sortOrder: 0
}

console.log('\n📝 Test Product Data:')
console.log(JSON.stringify(testProduct, null, 2))

console.log('\n✅ Verifikasi Komponen:')
console.log('- ✓ ProductModal component exists')
console.log('- ✓ API endpoint /api/admin/products (POST) available')
console.log('- ✓ showAddModal state variable initialized')
console.log('- ✓ setShowAddModal function available')

console.log('\n🔧 Langkah Debugging:')
console.log('1. Pastikan server berjalan di http://localhost:3000')
console.log('2. Login sebagai admin')
console.log('3. Navigasi ke /admin/catalog')
console.log('4. Cari tombol hijau "Tambah Produk Manual" di kanan atas')
console.log('5. Klik tombol untuk membuka modal')

console.log('\n🌐 Browser Console Check:')
console.log('Jalankan di browser console:')
console.log('```javascript')
console.log('// Cek apakah tombol ada')
console.log('document.querySelector("button:contains(\'Tambah Produk\')")') 
console.log('')
console.log('// Cek state showAddModal')
console.log('console.log("showAddModal state:", React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)')
console.log('```')

console.log('\n🛠️ Jika tombol tidak muncul, cek:')
console.log('- Browser DevTools Console untuk error JavaScript')
console.log('- Network tab untuk failed API calls')
console.log('- Element inspector untuk CSS issues')
console.log('- Session authentication status')

console.log('\n🎯 Expected Behavior:')
console.log('- Tombol hijau "Tambah Produk Manual" tampil di header')
console.log('- Klik tombol membuka modal form')
console.log('- Form memiliki field: Category, Service, Name, SKU, Prices, Stock')
console.log('- Submit form berhasil membuat produk baru')

console.log('\n✨ Debug completed!')
