import React, { useState, useEffect } from 'react';
import useSupabaseData from '../../../hooks/useSupabaseData';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PaymentMethods = ({ selectedMethod, onMethodSelect }) => {
  const [expandedCategory, setExpandedCategory] = useState('ewallet');
  const [paymentMethods, setPaymentMethods] = useState({});
  const { paymentMethods: supabasePaymentMethods, isLoading } = useSupabaseData();

  // Transform Supabase payment methods data
  useEffect(() => {
    if (supabasePaymentMethods && supabasePaymentMethods.length > 0) {
      const groupedMethods = supabasePaymentMethods.reduce((acc, method) => {
        const category = method.category || 'other';
        
        if (!acc[category]) {
          acc[category] = {
            title: getCategoryTitle(category),
            icon: getCategoryIcon(category),
            methods: []
          };
        }
        
        acc[category].methods.push({
          id: method.id,
          name: method.name,
          logo: method.logo_url || getDefaultLogo(method.name),
          processingTime: method.processing_time || 'Instan',
          fee: method.fee || 0,
          popular: method.is_popular || false,
          description: method.description
        });
        
        return acc;
      }, {});

      // Sort methods within each category by popularity and name
      Object.keys(groupedMethods).forEach(category => {
        groupedMethods[category].methods.sort((a, b) => {
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return a.name.localeCompare(b.name);
        });
      });

      setPaymentMethods(groupedMethods);
    } else {
      // Fallback to mock data if Supabase data is not available
      setPaymentMethods(getFallbackPaymentMethods());
    }
  }, [supabasePaymentMethods]);

  const getCategoryTitle = (category) => {
    const titles = {
      'ewallet': 'E-Wallet',
      'bank': 'Transfer Bank',
      'virtual': 'Virtual Account',
      'retail': 'Retail Store',
      'qris': 'QRIS',
      'other': 'Lainnya'
    };
    return titles[category] || category;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'ewallet': 'Smartphone',
      'bank': 'Building2',
      'virtual': 'CreditCard',
      'retail': 'Store',
      'qris': 'QrCode',
      'other': 'MoreHorizontal'
    };
    return icons[category] || 'CreditCard';
  };

  const getDefaultLogo = (methodName) => {
    const logos = {
      'DANA': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
      'OVO': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      'GoPay': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      'ShopeePay': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
      'BCA': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop',
      'Mandiri': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop',
      'BNI': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop'
    };
    return logos[methodName] || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop';
  };

  const getFallbackPaymentMethods = () => ({
    ewallet: {
      title: 'E-Wallet',
      icon: 'Smartphone',
      methods: [
        {
          id: 'dana',
          name: 'DANA',
          logo: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=100&h=100&fit=crop',
          processingTime: 'Instan',
          fee: 0,
          popular: true
        },
        {
          id: 'ovo',
          name: 'OVO',
          logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
          processingTime: 'Instan',
          fee: 0,
          popular: true
        },
        {
          id: 'gopay',
          name: 'GoPay',
          logo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop',
          processingTime: 'Instan',
          fee: 0,
          popular: true
        }
      ]
    },
    bank: {
      title: 'Transfer Bank',
      icon: 'Building2',
      methods: [
        {
          id: 'bca',
          name: 'Bank BCA',
          logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop',
          processingTime: '1-5 menit',
          fee: 2500
        },
        {
          id: 'mandiri',
          name: 'Bank Mandiri',
          logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=100&h=100&fit=crop',
          processingTime: '1-5 menit',
          fee: 2500
        }
      ]
    }
  });

  const formatIDR = (amount) => {
    if (amount === 0) return 'Gratis';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="CreditCard" size={24} className="text-primary" />
        <h2 className="text-xl font-gaming font-bold text-foreground">Metode Pembayaran</h2>
      </div>
      <div className="space-y-4">
        {Object.entries(paymentMethods)?.map(([categoryKey, category]) => (
          <div key={categoryKey} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between p-4 bg-surface/30 hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon name={category?.icon} size={20} className="text-primary" />
                <span className="font-semibold text-foreground">{category?.title}</span>
                {categoryKey === 'ewallet' && (
                  <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                    Populer
                  </span>
                )}
              </div>
              <Icon 
                name="ChevronDown" 
                size={20} 
                className={`text-text-secondary transition-transform ${
                  expandedCategory === categoryKey ? 'rotate-180' : ''
                }`} 
              />
            </button>

            {expandedCategory === categoryKey && (
              <div className="p-4 space-y-3 bg-background/50">
                {category?.methods?.map((method) => (
                  <div
                    key={method?.id}
                    onClick={() => onMethodSelect(method)}
                    className={`flex items-center space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMethod?.id === method?.id
                        ? 'border-primary bg-primary/10 shadow-neon-blue'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    <div className="relative">
                      <Image
                        src={method?.logo}
                        alt={method?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      {method?.popular && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gaming-gold rounded-full flex items-center justify-center">
                          <Icon name="Star" size={10} className="text-black" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{method?.name}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Icon name="Clock" size={14} className="text-text-secondary" />
                          <span className="text-sm text-text-secondary">{method?.processingTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="DollarSign" size={14} className="text-text-secondary" />
                          <span className="text-sm text-text-secondary">
                            Biaya: {formatIDR(method?.fee)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {selectedMethod?.id === method?.id ? (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Icon name="Check" size={16} className="text-black" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-border rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Security Notice */}
      <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-success mt-0.5" />
          <div>
            <h4 className="font-semibold text-success mb-1">Pembayaran Aman</h4>
            <p className="text-sm text-success/80">
              Semua transaksi dilindungi dengan enkripsi SSL 256-bit dan standar keamanan PCI DSS Level 1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;