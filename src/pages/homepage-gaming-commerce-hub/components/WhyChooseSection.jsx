import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WhyChooseSection = () => {
  const features = [
    {
      icon: "Zap",
      title: "Transaksi Super Cepat",
      subtitle: "30 Detik Selesai",
      description: "Sistem otomatis yang memproses top-up dalam hitungan detik. Tidak perlu menunggu lama, langsung main!",
      benefits: [
        "Proses otomatis 24/7",
        "Konfirmasi instan via WhatsApp",
        "Tidak ada antrian manual",
        "Sistem backup redundan"
      ],
      color: "primary",
      gradient: "from-primary to-cyan-300"
    },
    {
      icon: "Shield",
      title: "Keamanan Enterprise",
      subtitle: "Bank-Grade Security",
      description: "Perlindungan berlapis dengan enkripsi tingkat perbankan dan monitoring keamanan 24/7 untuk setiap transaksi.",
      benefits: [
        "Enkripsi SSL 256-bit",
        "Sertifikasi PCI DSS Level 1",
        "Monitoring fraud real-time",
        "Jaminan uang kembali 100%"
      ],
      color: "success",
      gradient: "from-success to-emerald-300"
    },
    {
      icon: "Users",
      title: "Komunitas Terpercaya",
      subtitle: "2M+ Gamer Indonesia",
      description: "Bergabung dengan jutaan gamer Indonesia yang sudah mempercayai WMX TOPUP untuk kebutuhan gaming mereka.",
      benefits: [
        "Review dari gamer verified",
        "Forum komunitas aktif",
        "Tips & trik dari pro player",
        "Event eksklusif member"
      ],
      color: "secondary",
      gradient: "from-secondary to-purple-300"
    }
  ];

  const additionalFeatures = [
    {
      icon: "Headphones",
      title: "Customer Support 24/7",
      description: "Tim support gaming expert siap membantu kapan saja"
    },
    {
      icon: "Gift",
      title: "Bonus & Reward",
      description: "Program loyalitas dengan bonus menarik setiap transaksi"
    },
    {
      icon: "Smartphone",
      title: "Mobile Optimized",
      description: "Pengalaman top-up yang sempurna di semua device"
    },
    {
      icon: "CreditCard",
      title: "Harga Terbaik",
      description: "Jaminan harga termurah dengan kualitas service terbaik"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Award" size={20} className="text-gaming-gold" />
            <span className="text-gaming-gold font-accent font-bold uppercase tracking-wider text-sm">
              Why Choose WMX TOPUP
            </span>
            <Icon name="Award" size={20} className="text-gaming-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gradient mb-6">
            Kenapa Pilih WMX TOPUP?
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Kami tidak hanya menyediakan layanan top-up, tapi pengalaman gaming yang lebih baik untuk setiap gamer Indonesia
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {features?.map((feature, index) => (
            <div key={index} className="gaming-card p-8 group hover:border-primary/40 relative overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature?.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-${feature?.color}/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon name={feature?.icon} size={32} className={`text-${feature?.color}`} />
                </div>

                {/* Title & Subtitle */}
                <div className="mb-4">
                  <h3 className="text-2xl font-gaming font-bold text-foreground mb-2">
                    {feature?.title}
                  </h3>
                  <div className={`text-${feature?.color} font-accent font-bold text-lg`}>
                    {feature?.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed mb-6">
                  {feature?.description}
                </p>

                {/* Benefits List */}
                <div className="space-y-3">
                  {feature?.benefits?.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className={`w-5 h-5 bg-${feature?.color}/20 rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon name="Check" size={12} className={`text-${feature?.color}`} />
                      </div>
                      <span className="text-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="gaming-card p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-gaming font-bold text-foreground mb-2">
              Fitur Lengkap untuk Gamer
            </h3>
            <p className="text-text-secondary">
              Semua yang kamu butuhkan dalam satu platform terpercaya
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures?.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon name={feature?.icon} size={20} className="text-primary" />
                </div>
                <h4 className="font-gaming font-bold text-foreground mb-2">
                  {feature?.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {feature?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="gaming-card p-8 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
            <h3 className="text-3xl font-gaming font-bold text-gaming-gradient mb-4">
              Siap Memulai Petualangan Gaming?
            </h3>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan jutaan gamer yang sudah merasakan kemudahan dan keamanan top-up di WMX TOPUP
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/game-selection-hub">
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
                  iconName="Gamepad2"
                  iconPosition="left"
                >
                  Mulai Top Up Sekarang
                </Button>
              </Link>
              <Link to="/gaming-community-portal">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  iconName="Users"
                  iconPosition="left"
                >
                  Gabung Komunitas
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-border">
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="text-sm">Transaksi Aman</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Zap" size={16} className="text-primary" />
                <span className="text-sm">Proses Instan</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Award" size={16} className="text-gaming-gold" />
                <span className="text-sm">Terpercaya</span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Icon name="Headphones" size={16} className="text-secondary" />
                <span className="text-sm">Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;