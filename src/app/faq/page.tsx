'use client'

import * as React from "react"
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Mail, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

const faqData = [
  {
    category: "General",
    items: [
      {
        question: "Apa itu WMX TopUp?",
        answer: "WMX TopUp adalah platform top-up game online terpercaya yang menyediakan berbagai layanan pembelian in-game currency, voucher game, dan item gaming dengan harga kompetitif dan proses yang cepat."
      },
      {
        question: "Bagaimana cara melakukan pembelian?",
        answer: "Pilih game yang ingin Anda top-up, masukkan User ID/Player ID, pilih nominal yang diinginkan, pilih metode pembayaran, dan ikuti instruksi pembayaran. Diamond/item akan otomatis masuk ke akun game Anda."
      },
      {
        question: "Berapa lama proses top-up?",
        answer: "Proses top-up biasanya instan setelah pembayaran berhasil dikonfirmasi. Maksimal 1-5 menit untuk semua jenis game."
      }
    ]
  },
  {
    category: "Payment",
    items: [
      {
        question: "Metode pembayaran apa saja yang tersedia?",
        answer: "Kami menerima berbagai metode pembayaran seperti Transfer Bank, E-Wallet (OVO, GoPay, DANA, ShopeePay), Indomaret, Alfamart, dan QRIS."
      },
      {
        question: "Apakah ada biaya tambahan?",
        answer: "Tidak ada biaya tambahan. Harga yang tertera sudah final dan sesuai dengan yang harus dibayar."
      },
      {
        question: "Bagaimana jika pembayaran gagal?",
        answer: "Jika pembayaran gagal, silakan coba lagi atau hubungi customer service kami. Dana akan dikembalikan jika terjadi kesalahan sistem."
      }
    ]
  },
  {
    category: "Account",
    items: [
      {
        question: "Apakah perlu mendaftar akun?",
        answer: "Ya, Anda perlu membuat akun untuk melacak riwayat transaksi dan mendapatkan penawaran khusus member."
      },
      {
        question: "Bagaimana cara reset password?",
        answer: "Klik 'Lupa Password' di halaman login, masukkan email Anda, dan ikuti instruksi yang dikirim ke email untuk reset password."
      },
      {
        question: "Bisakah mengubah informasi akun?",
        answer: "Ya, Anda dapat mengubah informasi akun melalui halaman Dashboard > Profile setelah login."
      }
    ]
  },
  {
    category: "Support",
    items: [
      {
        question: "Bagaimana cara menghubungi customer service?",
        answer: "Anda dapat menghubungi kami melalui WhatsApp, email support@wmxtopup.com, atau live chat di website ini."
      },
      {
        question: "Jam operasional customer service?",
        answer: "Customer service kami tersedia 24/7 untuk membantu Anda kapan saja."
      },
      {
        question: "Bagaimana jika item tidak masuk?",
        answer: "Segera hubungi customer service dengan menyertakan bukti transaksi dan screenshot User ID/Player ID yang digunakan."
      }
    ]
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = React.useState<string[]>([])
  const [activeCategory, setActiveCategory] = React.useState("General")

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-neon-magenta to-neon-cyan overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                <HelpCircle className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan WMX TopUp
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {faqData.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setActiveCategory(category.category)}
                  className={cn(
                    "px-6 py-3 rounded-full font-medium transition-all duration-300",
                    activeCategory === category.category
                      ? "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-lg"
                      : "bg-white text-gray-600 hover:text-neon-magenta border border-gray-200 hover:border-neon-magenta/30"
                  )}
                >
                  {category.category}
                </button>
              ))}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {faqData
                .find(cat => cat.category === activeCategory)
                ?.items.map((item, index) => {
                  const itemId = `${activeCategory}-${index}`
                  const isOpen = openItems.includes(itemId)

                  return (
                    <div
                      key={itemId}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                      >
                        <span className="text-lg font-semibold text-gray-900 pr-8">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-neon-magenta flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-8 pb-6">
                          <div className="h-px bg-gradient-to-r from-neon-magenta/20 to-transparent mb-4" />
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Masih Ada Pertanyaan?
              </h2>
              <p className="text-gray-600">
                Tim customer service kami siap membantu Anda 24/7
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 text-sm mb-4">Chat langsung dengan CS</p>
                <button className="text-neon-magenta hover:text-neon-cyan font-medium transition-colors">
                  Chat Sekarang
                </button>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm mb-4">support@wmxtopup.com</p>
                <button className="text-neon-magenta hover:text-neon-cyan font-medium transition-colors">
                  Kirim Email
                </button>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-r from-neon-magenta to-neon-cyan rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Telepon</h3>
                <p className="text-gray-600 text-sm mb-4">+62 xxx-xxxx-xxxx</p>
                <button className="text-neon-magenta hover:text-neon-cyan font-medium transition-colors">
                  Hubungi Kami
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
