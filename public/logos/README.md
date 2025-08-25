# Logo Assets Directory

Direktori ini berisi logo-logo untuk games, publishers, dan payment methods yang ditampilkan di homepage.

## Struktur Folder

```
logos/
├── games/          # Logo game-game populer
├── publishers/     # Logo publisher game 
├── payments/       # Logo metode pembayaran
└── README.md       # File ini
```

## Logo Games yang Diperlukan

Simpan logo game berikut di folder `games/`:

### Game Logos (`/logos/games/`)
- `mobile-legends.png` - Logo Mobile Legends: Bang Bang
- `free-fire.png` - Logo Free Fire
- `pubg-mobile.png` - Logo PUBG Mobile
- `genshin-impact.png` - Logo Genshin Impact
- `valorant.png` - Logo Valorant
- `cod-mobile.png` - Logo Call of Duty Mobile
- `honkai-star-rail.png` - Logo Honkai Star Rail
- `arena-of-valor.png` - Logo Arena of Valor

### Publisher Logos (`/logos/publishers/`)
- `moonton.png` - Logo Moonton (Mobile Legends)
- `garena.png` - Logo Garena (Free Fire)
- `tencent.png` - Logo Tencent (PUBG Mobile)
- `riot.png` - Logo Riot Games (Valorant)
- `mihoyo.png` - Logo miHoYo/HoYoverse (Genshin Impact)

### Payment Method Logos (`/logos/payments/`)
- `dana.png` - Logo DANA
- `ovo.png` - Logo OVO
- `gopay.png` - Logo GoPay
- `shopeepay.png` - Logo ShopeePay
- `qris.png` - Logo QRIS
- `bank.png` - Logo Bank Transfer (generic)
- `indomaret.png` - Logo Indomaret
- `alfamart.png` - Logo Alfamart
- `pulsa.png` - Icon untuk mobile credit
- `ewallet.png` - Icon untuk e-wallet
- `social.png` - Icon untuk social media boost
- `utilities.png` - Icon untuk utilities/PPOB

## Spesifikasi Logo

### Format
- **Format file**: PNG dengan background transparan
- **Resolusi optimal**: 512x512px atau lebih tinggi
- **Aspect ratio**: Square (1:1) atau sesuai logo asli

### Kualitas
- Logo harus berkualitas tinggi dan jernih
- Background transparan untuk fleksibilitas
- Hindari logo dengan compression artifacts
- Pastikan logo legal untuk digunakan

## Fallback System

Jika logo tidak ditemukan atau gagal dimuat, sistem akan menampilkan emoji fallback:
- 🏆 untuk Mobile Legends
- 🔥 untuk Free Fire  
- 🎯 untuk PUBG Mobile
- ⚡ untuk Genshin Impact
- 🎮 untuk Valorant
- 💀 untuk COD Mobile
- 🌟 untuk Honkai Star Rail
- ⚔️ untuk Arena of Valor

## Tips

1. **Optimisasi ukuran**: Compress logo menggunakan tools seperti TinyPNG
2. **Konsistensi**: Pastikan semua logo memiliki style dan kualitas yang konsisten
3. **Testing**: Test tampilan logo di berbagai ukuran layar
4. **Copyright**: Pastikan Anda memiliki izin untuk menggunakan logo tersebut

## Cara Menambah Logo Baru

1. Simpan file logo di folder yang sesuai
2. Update komponen React terkait jika diperlukan
3. Test tampilan di browser
4. Pastikan fallback emoji tersedia jika logo gagal dimuat

---

**Note**: Logo-logo ini digunakan untuk tujuan identifikasi brand dan memudahkan user experience. Pastikan penggunaan logo sesuai dengan guidelines masing-masing brand.
