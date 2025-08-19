import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStep, setInstallStep] = useState(0);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallStatus = () => {
      if (window.matchMedia('(display-mode: standalone)')?.matches || 
          window.navigator?.standalone === true) {
        setIsInstalled(true);
      }
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e?.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    checkInstallStatus();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show install prompt after 30 seconds if not installed
    const timer = setTimeout(() => {
      if (!isInstalled && !showInstallPrompt) {
        setShowInstallPrompt(true);
      }
    }, 30000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, [isInstalled, showInstallPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt?.prompt();
      const { outcome } = await deferredPrompt?.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // Show manual installation steps
      setInstallStep(1);
    }
  };

  const installSteps = [
    {
      browser: 'Chrome/Edge',
      steps: [
        'Tap menu (⋮) di pojok kanan atas',
        'Pilih "Add to Home screen"',
        'Tap "Add" untuk konfirmasi',
        'WMX TOPUP akan muncul di home screen'
      ],
      icon: 'Chrome'
    },
    {
      browser: 'Safari (iOS)',
      steps: [
        'Tap tombol Share (□↗) di bawah',
        'Scroll dan pilih "Add to Home Screen"',
        'Tap "Add" di pojok kanan atas',
        'WMX TOPUP akan muncul di home screen'
      ],
      icon: 'Safari'
    },
    {
      browser: 'Firefox',
      steps: [
        'Tap menu (⋮) di pojok kanan atas',
        'Pilih "Install"',
        'Tap "Add" untuk konfirmasi',
        'WMX TOPUP akan muncul di home screen'
      ],
      icon: 'Firefox'
    }
  ];

  const pwaFeatures = [
    {
      icon: 'Zap',
      title: 'Akses Instan',
      description: 'Buka langsung dari home screen tanpa browser'
    },
    {
      icon: 'Wifi',
      title: 'Offline Mode',
      description: 'Tetap bisa akses fitur dasar tanpa internet'
    },
    {
      icon: 'Bell',
      title: 'Push Notifications',
      description: 'Dapatkan notifikasi promo dan update transaksi'
    },
    {
      icon: 'Smartphone',
      title: 'Native Experience',
      description: 'Tampilan dan performa seperti aplikasi asli'
    },
    {
      icon: 'Shield',
      title: 'Secure & Private',
      description: 'Data tersimpan aman di device Anda'
    },
    {
      icon: 'Download',
      title: 'No App Store',
      description: 'Install langsung tanpa download dari store'
    }
  ];

  if (isInstalled) {
    return (
      <div className="bg-card rounded-2xl shadow-gaming border border-border p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
            App Sudah Terinstall!
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            WMX TOPUP sudah tersedia di home screen Anda
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-text-secondary">
            <div className="flex items-center space-x-1">
              <Icon name="Zap" size={16} className="text-success" />
              <span>Akses Cepat</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Bell" size={16} className="text-success" />
              <span>Notifikasi Aktif</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
      {installStep === 0 ? (
        <>
          {/* Main Install Prompt */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-neon-blue">
                  <Icon name="Zap" size={28} className="text-black" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gaming-gold rounded-full flex items-center justify-center">
                  <Icon name="Plus" size={12} className="text-black" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-1">
                  Install WMX TOPUP
                </h3>
                <p className="text-sm text-text-secondary">
                  Dapatkan pengalaman gaming terbaik langsung di home screen
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowInstallPrompt(false)}
                className="w-8 h-8"
              >
                <Icon name="X" size={16} className="text-text-secondary" />
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {pwaFeatures?.slice(0, 4)?.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-surface rounded-lg border border-border"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={feature?.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {feature?.title}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {feature?.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Install Buttons */}
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow h-12"
              >
                <Icon name="Download" size={18} className="mr-2" />
                {deferredPrompt ? 'Install Sekarang' : 'Panduan Install'}
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowInstallPrompt(false)}
                className="border-border text-text-secondary hover:bg-surface"
              >
                Nanti Saja
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 bg-surface/50 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Icon name="Smartphone" size={16} className="text-primary" />
                <span className="text-foreground font-medium">0 MB</span>
                <span className="text-text-secondary">download</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Zap" size={16} className="text-success" />
                <span className="text-foreground font-medium">3x</span>
                <span className="text-text-secondary">lebih cepat</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-gaming-gold" />
                <span className="text-foreground font-medium">100%</span>
                <span className="text-text-secondary">aman</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Installation Steps */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInstallStep(0)}
                className="w-8 h-8"
              >
                <Icon name="ArrowLeft" size={16} className="text-text-secondary" />
              </Button>
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Cara Install
              </h3>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {installSteps?.map((guide, index) => (
              <div
                key={index}
                className="bg-surface rounded-lg p-4 border border-border"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Globe" size={18} className="text-primary" />
                  </div>
                  <h4 className="font-semibold text-foreground">
                    {guide?.browser}
                  </h4>
                </div>
                
                <div className="space-y-2">
                  {guide?.steps?.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">
                          {stepIndex + 1}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Icon name="Info" size={16} className="text-primary" />
                <p className="text-sm text-primary">
                  Setelah install, WMX TOPUP akan muncul seperti aplikasi biasa di home screen Anda
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PWAInstallPrompt;