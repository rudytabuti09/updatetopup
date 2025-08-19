import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TrustElements = () => {
  const [liveTransactions, setLiveTransactions] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(0);

  const recentTransactions = [
    {
      id: 1,
      game: 'Mobile Legends',
      amount: 'Rp 50.000',
      user: 'Ahmad***',
      time: '2 menit yang lalu',
      status: 'success'
    },
    {
      id: 2,
      game: 'Free Fire',
      amount: 'Rp 100.000',
      user: 'Sari***',
      time: '5 menit yang lalu',
      status: 'success'
    },
    {
      id: 3,
      game: 'PUBG Mobile',
      amount: 'Rp 75.000',
      user: 'Budi***',
      time: '8 menit yang lalu',
      status: 'success'
    },
    {
      id: 4,
      game: 'Genshin Impact',
      amount: 'Rp 200.000',
      user: 'Maya***',
      time: '12 menit yang lalu',
      status: 'success'
    }
  ];

  const trustStats = [
    {
      icon: 'Users',
      value: '2.5M+',
      label: 'Pengguna Aktif',
      color: 'text-primary'
    },
    {
      icon: 'ShoppingCart',
      value: '15M+',
      label: 'Transaksi Berhasil',
      color: 'text-success'
    },
    {
      icon: 'Star',
      value: '4.9/5',
      label: 'Rating Pengguna',
      color: 'text-gaming-gold'
    },
    {
      icon: 'Shield',
      value: '99.9%',
      label: 'Tingkat Keamanan',
      color: 'text-secondary'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Rizki Pratama',
      rating: 5,
      comment: 'Transaksi cepat dan aman! Top up langsung masuk ke akun game.',
      game: 'Mobile Legends',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: 2,
      name: 'Dewi Sartika',
      rating: 5,
      comment: 'Pelayanan customer service sangat responsif dan membantu.',
      game: 'Free Fire',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop'
    },
    {
      id: 3,
      name: 'Andi Wijaya',
      rating: 5,
      comment: 'Harga kompetitif dengan banyak pilihan metode pembayaran.',
      game: 'PUBG Mobile',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
    }
  ];

  useEffect(() => {
    setLiveTransactions(recentTransactions);
    
    const interval = setInterval(() => {
      setCurrentNotification(prev => (prev + 1) % recentTransactions?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Live Transaction Notifications */}
      <div className="gaming-card p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Icon name="Activity" size={20} className="text-success" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
          <h3 className="font-semibold text-foreground">Transaksi Real-time</h3>
        </div>

        <div className="space-y-2">
          {liveTransactions?.slice(0, 3)?.map((transaction, index) => (
            <div
              key={transaction?.id}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                index === currentNotification % 3
                  ? 'bg-success/10 border border-success/20' :'bg-surface/20'
              }`}
            >
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{transaction?.user}</span> berhasil top up{' '}
                  <span className="font-medium text-primary">{transaction?.game}</span>
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-success font-medium">{transaction?.amount}</span>
                  <span className="text-xs text-text-secondary">•</span>
                  <span className="text-xs text-text-secondary">{transaction?.time}</span>
                </div>
              </div>
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
          ))}
        </div>
      </div>
      {/* Trust Statistics */}
      <div className="gaming-card p-6">
        <h3 className="font-semibold text-foreground mb-4 text-center">Dipercaya Jutaan Gamer</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustStats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-surface flex items-center justify-center ${stat?.color}`}>
                <Icon name={stat?.icon} size={24} />
              </div>
              <div className={`text-xl font-bold ${stat?.color}`}>{stat?.value}</div>
              <div className="text-xs text-text-secondary">{stat?.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Customer Testimonials */}
      <div className="gaming-card p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Kata Mereka</h3>
        </div>

        <div className="space-y-4">
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="p-4 bg-surface/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{testimonial?.name}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial?.rating)]?.map((_, i) => (
                        <Icon key={i} name="Star" size={12} className="text-gaming-gold fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">"{testimonial?.comment}"</p>
                  <div className="flex items-center space-x-2">
                    <Icon name="Gamepad2" size={12} className="text-primary" />
                    <span className="text-xs text-primary">{testimonial?.game}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Money Back Guarantee */}
      <div className="gaming-card p-4 bg-gradient-to-r from-success/10 to-primary/10 border border-success/20">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
            <Icon name="RefreshCw" size={20} className="text-success" />
          </div>
          <div>
            <h4 className="font-semibold text-success">Garansi 100% Uang Kembali</h4>
            <p className="text-sm text-success/80">
              Jika transaksi gagal atau item tidak masuk, uang akan dikembalikan penuh dalam 24 jam.
            </p>
          </div>
        </div>
      </div>
      {/* Support Contact */}
      <div className="gaming-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Headphones" size={20} className="text-primary" />
            <div>
              <h4 className="font-semibold text-foreground">Butuh Bantuan?</h4>
              <p className="text-sm text-text-secondary">Tim support siap membantu 24/7</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors">
              <Icon name="MessageCircle" size={16} className="text-primary" />
            </button>
            <button className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center hover:bg-success/30 transition-colors">
              <Icon name="Phone" size={16} className="text-success" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustElements;