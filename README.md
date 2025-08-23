# 🚀 WMX TOPUP - Digital Top-Up Platform

Sebuah platform top-up digital modern yang dibangun dengan Next.js, TypeScript, dan Prisma. Platform ini menyediakan layanan top-up untuk game online, pulsa, e-money, dan layanan digital lainnya.

## ✨ Fitur Utama

- 🎮 **Multi-kategori produk**: Game online, pulsa, e-money
- 👤 **User authentication**: Login/register dengan NextAuth.js
- 💳 **Payment gateway**: Integrasi dengan Midtrans
- 🔄 **Provider integration**: API VIP-Reseller untuk produk
- 💰 **Balance system**: Wallet pengguna dengan riwayat transaksi
- 📊 **Admin dashboard**: Management system lengkap
- 🔔 **Webhook integration**: Auto-update status pesanan
- 📱 **Responsive design**: Mobile-first approach
- 🌙 **Modern UI**: Glass morphism dengan dark theme

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js dengan Prisma adapter
- **Payment**: Midtrans (sandbox & production)
- **Provider**: VIP-Reseller.co.id API
- **UI Components**: Radix UI, Lucide React, Framer Motion

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ atau lebih baru
- PostgreSQL database
- Account Midtrans (untuk payment gateway)
- API credentials VIP-Reseller (untuk produk)

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd wmx_topup
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file dan isi dengan credentials yang diperlukan:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/wmx_topup"
   
   # VIP-Reseller API
   VIP_RESELLER_API_URL="https://vip-reseller.co.id/api"
   VIP_RESELLER_API_KEY="your_api_key"
   VIP_RESELLER_API_ID="your_api_id"
   
   # Midtrans
   MIDTRANS_SERVER_KEY="your_server_key"
   MIDTRANS_CLIENT_KEY="your_client_key"
   MIDTRANS_IS_PRODUCTION=false
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET="your_nextauth_secret"
   ```

4. **Setup database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push database schema
   npm run db:push
   
   # Seed sample data
   npm run db:seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Project

```
wmx_topup/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding script
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API endpoints
│   │   ├── auth/         # Authentication pages
│   │   ├── catalog/      # Product catalog
│   │   ├── dashboard/    # User dashboard
│   │   └── admin/        # Admin panel
│   ├── components/       # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   ├── sections/     # Page sections
│   │   └── forms/        # Form components
│   ├── lib/              # Utility libraries
│   │   ├── auth.ts       # NextAuth configuration
│   │   ├── prisma.ts     # Database client
│   │   ├── midtrans.ts   # Payment gateway
│   │   └── vip-reseller.ts # Provider API
│   └── types/            # TypeScript definitions
├── public/               # Static assets
└── ...
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:seed         # Seed sample data
npm run db:studio       # Open Prisma Studio
npm run db:reset        # Reset database with fresh data
```

## 👤 Demo Accounts

Setelah menjalankan seeding, Anda bisa login dengan akun demo:

- **Admin**: `admin@wmx.com` / `admin123`
- **User**: `user@wmx.com` / `user123`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Services & Products
- `GET /api/services` - Get daftar layanan dan produk
- `POST /api/services?action=sync` - Sync data dari VIP-Reseller
- `POST /api/services/nickname` - Check nickname game

### Orders
- `POST /api/orders/create` - Buat pesanan baru
- `GET /api/orders/[orderNumber]` - Get detail pesanan
- `GET /api/orders/track` - Track status pesanan

### Webhooks
- `POST /api/webhooks/midtrans` - Webhook notifikasi Midtrans

## 🎨 UI Components

Project ini menggunakan design system modern dengan:

- **Glass Morphism**: Efek transparan dengan blur
- **Gradient Buttons**: Tombol dengan gradient warna
- **Neon Colors**: Skema warna neon untuk accent
- **Dark Theme**: Dark mode sebagai default
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions dan micro-interactions

## 🔒 Environment Variables

Daftarlengkap environment variables yang diperlukan:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/wmx_topup"

# VIP-Reseller API Configuration
VIP_RESELLER_API_URL="https://vip-reseller.co.id/api"
VIP_RESELLER_API_KEY="your_vip_reseller_api_key"
VIP_RESELLER_API_ID="your_vip_reseller_api_id"

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key_here
MIDTRANS_CLIENT_KEY=your_midtrans_client_key_here
MIDTRANS_IS_PRODUCTION=false

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

## 📚 Documentation

- **Database Schema**: Lihat `prisma/schema.prisma` untuk struktur database lengkap
- **API Documentation**: Setiap endpoint memiliki JSDoc comments
- **Component Props**: TypeScript interfaces untuk semua props
- **Error Handling**: Comprehensive error handling di API dan UI

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

Project ini menggunakan MIT License. Lihat `LICENSE` file untuk detail.

## 🆘 Support

Jika Anda menemukan bug atau memiliki pertanyaan:

1. Check existing issues di GitHub
2. Buat issue baru dengan detail yang jelas
3. Sertakan screenshot jika memungkinkan

---

**WMX TOPUP** - Platform top-up digital terpercaya 🚀
