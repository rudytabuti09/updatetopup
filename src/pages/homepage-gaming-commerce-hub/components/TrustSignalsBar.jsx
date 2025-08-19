import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrustSignalsBar = () => {
  const paymentMethods = [
    {
      name: "Dana",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=40&fit=crop&crop=center",
      type: "E-Wallet"
    },
    {
      name: "OVO",
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=40&fit=crop&crop=center",
      type: "E-Wallet"
    },
    {
      name: "GoPay",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=40&fit=crop&crop=center",
      type: "E-Wallet"
    },
    {
      name: "ShopeePay",
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=40&fit=crop&crop=center",
      type: "E-Wallet"
    },
    {
      name: "Bank Transfer",
      logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=40&fit=crop&crop=center",
      type: "Banking"
    },
    {
      name: "Credit Card",
      logo: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=40&fit=crop&crop=center",
      type: "Card"
    }
  ];

  const certifications = [
    {
      name: "SSL Secured",
      icon: "Shield",
      description: "256-bit Encryption"
    },
    {
      name: "PCI DSS",
      icon: "CreditCard",
      description: "Payment Security"
    },
    {
      name: "ISO 27001",
      icon: "Award",
      description: "Security Standard"
    },
    {
      name: "Bank Grade",
      icon: "Building2",
      description: "Security Level"
    }
  ];

  const liveStats = [
    {
      label: "Transaksi Hari Ini",
      value: "163,429",
      icon: "TrendingUp",
      color: "text-success"
    },
    {
      label: "Gamer Aktif",
      value: "2.1M+",
      icon: "Users",
      color: "text-primary"
    },
    {
      label: "Waktu Rata-rata",
      value: "28 detik",
      icon: "Clock",
      color: "text-gaming-gold"
    },
    {
      label: "Rating Kepuasan",
      value: "4.9/5",
      icon: "Star",
      color: "text-gaming-gold"
    }
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Payment Methods */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-gaming font-bold text-foreground mb-2">
              Metode Pembayaran Terpercaya
            </h3>
            <p className="text-text-secondary">
              Pilih dari berbagai metode pembayaran yang aman dan mudah
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {paymentMethods?.map((method, index) => (
              <div key={index} className="group">
                <div className="bg-background border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200 hover:shadow-gaming">
                  <div className="aspect-[2/1] flex items-center justify-center mb-2">
                    <Image 
                      src={method?.logo} 
                      alt={method?.name}
                      className="max-w-full max-h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">{method?.name}</div>
                    <div className="text-xs text-text-secondary">{method?.type}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Certifications */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-gaming font-bold text-foreground mb-2">
              Keamanan Tingkat Enterprise
            </h3>
            <p className="text-text-secondary">
              Dilindungi dengan standar keamanan internasional terbaik
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications?.map((cert, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon name={cert?.icon} size={24} className="text-primary" />
                </div>
                <h4 className="font-gaming font-bold text-foreground mb-1">{cert?.name}</h4>
                <p className="text-sm text-text-secondary">{cert?.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Live Statistics */}
        <div className="gaming-card p-8 border border-primary/20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-success font-medium text-sm uppercase tracking-wider">
                Live Statistics
              </span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-gaming font-bold text-foreground">
              Dipercaya Jutaan Gamer Indonesia
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {liveStats?.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Icon name={stat?.icon} size={24} className={stat?.color} />
                </div>
                <div className={`text-3xl font-gaming font-bold mb-1 ${stat?.color}`}>
                  {stat?.value}
                </div>
                <div className="text-text-secondary text-sm">
                  {stat?.label}
                </div>
              </div>
            ))}
          </div>

          {/* Trust Message */}
          <div className="text-center mt-8 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-text-secondary">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-sm">
                Transaksi Anda dilindungi dengan enkripsi 256-bit dan monitoring 24/7
              </span>
              <Icon name="Shield" size={16} className="text-success" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignalsBar;