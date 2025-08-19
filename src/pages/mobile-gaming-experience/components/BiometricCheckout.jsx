import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const BiometricCheckout = () => {
  const [biometricSupport, setBiometricSupport] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    // Check for biometric support
    const checkBiometricSupport = async () => {
      if ('credentials' in navigator && 'create' in navigator.credentials) {
        try {
          const available = await navigator.credentials?.create({
            publicKey: {
              challenge: new Uint8Array(32),
              rp: { name: "WMX TOPUP" },
              user: {
                id: new Uint8Array(16),
                name: "user@example.com",
                displayName: "User"
              },
              pubKeyCredParams: [{ alg: -7, type: "public-key" }],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required"
              }
            }
          });
          setBiometricSupport(true);
        } catch (error) {
          setBiometricSupport(false);
        }
      }
    };

    checkBiometricSupport();
  }, []);

  const quickPurchasePackages = [
    {
      id: 1,
      game: "Mobile Legends",
      package: "Diamond 275",
      price: "Rp 75.000",
      originalPrice: "Rp 85.000",
      discount: "12%",
      icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=80&h=80&fit=crop&crop=center",
      popular: true
    },
    {
      id: 2,
      game: "Free Fire",
      package: "Diamond 720",
      price: "Rp 95.000",
      originalPrice: "Rp 110.000",
      discount: "14%",
      icon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&h=80&fit=crop&crop=center",
      popular: false
    },
    {
      id: 3,
      game: "PUBG Mobile",
      package: "UC 325",
      price: "Rp 50.000",
      originalPrice: null,
      discount: null,
      icon: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=80&h=80&fit=crop&crop=center",
      popular: false
    }
  ];

  const handleBiometricAuth = async (packageData) => {
    setIsProcessing(true);
    setSelectedPackage(packageData);

    try {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }

      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('WMX TOPUP - Pembayaran Berhasil!', {
          body: `${packageData.package} untuk ${packageData.game} telah berhasil dibeli`,
          icon: '/favicon.ico'
        });
      }

      setIsProcessing(false);
      setSelectedPackage(null);
      
    } catch (error) {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  const handleQuickPurchase = (packageData) => {
    if (biometricSupport) {
      handleBiometricAuth(packageData);
    } else {
      setSelectedPackage(packageData);
      setShowCheckout(true);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Quick Purchase
              </h3>
              <p className="text-xs text-text-secondary">
                {biometricSupport ? 'Beli dengan sidik jari' : 'Beli dengan cepat'}
              </p>
            </div>
          </div>
          
          {biometricSupport && (
            <div className="flex items-center space-x-2 bg-success/10 px-3 py-1 rounded-full">
              <Icon name="Fingerprint" size={16} className="text-success" />
              <span className="text-xs text-success font-medium">Aktif</span>
            </div>
          )}
        </div>
      </div>
      {/* Quick Purchase Packages */}
      <div className="p-4 space-y-3">
        {quickPurchasePackages?.map((pkg) => (
          <div
            key={pkg?.id}
            className="relative bg-surface rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-200"
          >
            {pkg?.popular && (
              <div className="absolute -top-2 -right-2 bg-gaming-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                POPULER
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={pkg?.icon}
                  alt={pkg?.game}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Play" size={12} className="text-black" />
                </div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  {pkg?.game}
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  {pkg?.package}
                </p>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {pkg?.price}
                  </span>
                  {pkg?.originalPrice && (
                    <>
                      <span className="text-sm text-text-secondary line-through">
                        {pkg?.originalPrice}
                      </span>
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full font-medium">
                        -{pkg?.discount}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button
                  size="sm"
                  onClick={() => handleQuickPurchase(pkg)}
                  disabled={isProcessing && selectedPackage?.id === pkg?.id}
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow min-w-[80px]"
                >
                  {isProcessing && selectedPackage?.id === pkg?.id ? (
                    <Icon name="Loader2" size={16} className="animate-spin" />
                  ) : biometricSupport ? (
                    <Icon name="Fingerprint" size={16} />
                  ) : (
                    <Icon name="Zap" size={16} />
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10 min-w-[80px]"
                >
                  <Icon name="ShoppingCart" size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Biometric Setup */}
      {!biometricSupport && (
        <div className="p-4 border-t border-border">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Shield" size={20} className="text-primary" />
              <div>
                <h4 className="font-semibold text-primary">
                  Aktifkan Pembayaran Biometrik
                </h4>
                <p className="text-sm text-text-secondary">
                  Beli game dengan sekali sentuh menggunakan sidik jari
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">Lebih cepat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">Lebih aman</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">Tanpa password</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">Auto-fill</span>
              </div>
            </div>
            
            <Button 
              variant="default" 
              fullWidth
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
            >
              <Icon name="Fingerprint" size={16} className="mr-2" />
              Setup Biometrik Sekarang
            </Button>
          </div>
        </div>
      )}
      {/* Processing Overlay */}
      {isProcessing && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card rounded-2xl p-6 mx-4 max-w-sm w-full border border-border shadow-gaming-lg">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Icon name="Fingerprint" size={32} className="text-black" />
              </div>
              
              <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                Memproses Pembayaran
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {selectedPackage?.package} - {selectedPackage?.game}
              </p>
              <p className="text-xl font-bold text-primary mb-4">
                {selectedPackage?.price}
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-text-secondary">
                <Icon name="Loader2" size={16} className="animate-spin" />
                <span className="text-sm">Mengautentikasi...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricCheckout;