import React from 'react';
import Icon from '../../../components/AppIcon';

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'SSL 256-bit Encryption',
      description: 'Data Anda dienkripsi dengan standar keamanan tertinggi'
    },
    {
      icon: 'Lock',
      title: 'PCI DSS Compliant',
      description: 'Sertifikasi keamanan internasional untuk pembayaran'
    },
    {
      icon: 'Eye',
      title: 'Monitoring Real-time',
      description: 'Sistem keamanan 24/7 memantau setiap transaksi'
    },
    {
      icon: 'RefreshCw',
      title: 'Garansi Uang Kembali',
      description: '100% uang kembali jika transaksi gagal'
    }
  ];

  const trustBadges = [
    {
      name: 'SSL Secured',
      icon: 'ShieldCheck',
      color: 'text-success'
    },
    {
      name: 'PCI DSS',
      icon: 'Award',
      color: 'text-primary'
    },
    {
      name: 'Verified',
      icon: 'CheckCircle',
      color: 'text-gaming-gold'
    }
  ];

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="Shield" size={24} className="text-success" />
        <h2 className="text-xl font-gaming font-bold text-foreground">Keamanan Terjamin</h2>
      </div>
      {/* Trust Badges */}
      <div className="flex items-center justify-center space-x-6 mb-6 p-4 bg-surface/30 rounded-lg">
        {trustBadges?.map((badge, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <div className={`w-12 h-12 rounded-full bg-surface flex items-center justify-center ${badge?.color}`}>
              <Icon name={badge?.icon} size={24} />
            </div>
            <span className="text-xs font-medium text-text-secondary">{badge?.name}</span>
          </div>
        ))}
      </div>
      {/* Security Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {securityFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-surface/20 rounded-lg">
            <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature?.icon} size={16} className="text-success" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">{feature?.title}</h4>
              <p className="text-xs text-text-secondary mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Live Security Status */}
      <div className="flex items-center justify-between p-4 bg-success/10 rounded-lg border border-success/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-success rounded-full animate-ping opacity-75"></div>
          </div>
          <div>
            <span className="text-sm font-semibold text-success">Sistem Keamanan Aktif</span>
            <p className="text-xs text-success/80">Terakhir diperbarui: 19 Agustus 2025, 17:01</p>
          </div>
        </div>
        <Icon name="ShieldCheck" size={20} className="text-success" />
      </div>
      {/* Customer Support */}
      <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center space-x-2">
          <Icon name="Headphones" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            Butuh bantuan? Tim support kami siap membantu 24/7
          </span>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;