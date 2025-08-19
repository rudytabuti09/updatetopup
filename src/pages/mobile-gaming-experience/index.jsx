import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import MobileHeader from './components/MobileHeader';
import QuickAccessWidget from './components/QuickAccessWidget';
import BottomNavigation from './components/BottomNavigation';
import PushNotificationCenter from './components/PushNotificationCenter';
import OfflineModeIndicator from './components/OfflineModeIndicator';
import BiometricCheckout from './components/BiometricCheckout';
import GestureControls from './components/GestureControls';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const MobileGamingExperience = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [screenOrientation, setScreenOrientation] = useState('portrait');

  useEffect(() => {
    // Handle orientation changes
    const handleOrientationChange = () => {
      if (screen.orientation) {
        setScreenOrientation(screen.orientation?.angle === 0 || screen.orientation?.angle === 180 ? 'portrait' : 'landscape');
      }
    };

    // Add viewport meta tag for mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport?.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    // Listen for orientation changes
    if (screen.orientation) {
      screen.orientation?.addEventListener('change', handleOrientationChange);
    }

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const preventZoom = (e) => {
      const now = new Date()?.getTime();
      if (now - lastTouchEnd <= 300) {
        e?.preventDefault();
      }
      lastTouchEnd = now;
    };
    
    document.addEventListener('touchend', preventZoom, { passive: false });

    return () => {
      if (screen.orientation) {
        screen.orientation?.removeEventListener('change', handleOrientationChange);
      }
      document.removeEventListener('touchend', preventZoom);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const featuredGames = [
    {
      id: 1,
      name: "Mobile Legends: Bang Bang",
      category: "MOBA",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=200&fit=crop&crop=center",
      rating: 4.8,
      players: "100M+",
      trending: true,
      packages: [
        { diamonds: 275, price: "Rp 75.000", popular: true },
        { diamonds: 720, price: "Rp 185.000", popular: false }
      ]
    },
    {
      id: 2,
      name: "Free Fire MAX",
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop&crop=center",
      rating: 4.6,
      players: "80M+",
      trending: true,
      packages: [
        { diamonds: 720, price: "Rp 95.000", popular: true },
        { diamonds: 2000, price: "Rp 250.000", popular: false }
      ]
    },
    {
      id: 3,
      name: "PUBG Mobile",
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=200&fit=crop&crop=center",
      rating: 4.7,
      players: "75M+",
      trending: false,
      packages: [
        { uc: 325, price: "Rp 50.000", popular: true },
        { uc: 1800, price: "Rp 250.000", popular: false }
      ]
    }
  ];

  const mobileStats = [
    {
      icon: 'Smartphone',
      label: 'Mobile Users',
      value: '2.8M+',
      growth: '+15%',
      color: 'text-primary'
    },
    {
      icon: 'Zap',
      label: 'Avg Load Time',
      value: '1.2s',
      growth: '-30%',
      color: 'text-success'
    },
    {
      icon: 'Download',
      label: 'App Installs',
      value: '450K+',
      growth: '+25%',
      color: 'text-gaming-gold'
    },
    {
      icon: 'Star',
      label: 'User Rating',
      value: '4.9/5',
      growth: '+0.2',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Mobile Gaming Experience - WMX TOPUP</title>
        <meta name="description" content="Pengalaman gaming mobile terbaik dengan WMX TOPUP. Akses cepat, pembayaran biometrik, dan fitur offline untuk gamer Indonesia." />
        <meta name="keywords" content="mobile gaming, top up mobile, gaming indonesia, biometric payment, offline gaming" />
        <meta name="theme-color" content="#00d4ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="WMX TOPUP" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Helmet>
      {/* Mobile Header */}
      <MobileHeader 
        onMenuToggle={toggleMobileMenu}
        isMenuOpen={isMobileMenuOpen}
      />
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="fixed top-0 right-0 w-80 h-full bg-card border-l border-border shadow-gaming-lg">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-gaming font-bold text-foreground">
                  Menu
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8"
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <Button variant="default" fullWidth className="justify-start">
                <Icon name="User" size={18} className="mr-3" />
                Login / Register
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <Icon name="Settings" size={18} className="mr-3" />
                Pengaturan
              </Button>
              <Button variant="outline" fullWidth className="justify-start">
                <Icon name="HelpCircle" size={18} className="mr-3" />
                Bantuan
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <main className="pt-24 pb-20 px-4 space-y-6">
        {/* PWA Install Prompt */}
        <PWAInstallPrompt />

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 gap-3">
          {mobileStats?.map((stat, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-4 border border-border shadow-gaming"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={stat?.icon} size={18} className={stat?.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-secondary truncate">
                    {stat?.label}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {stat?.value}
                  </p>
                  <p className={`text-xs ${stat?.color}`}>
                    {stat?.growth}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Access Widget */}
        <QuickAccessWidget />

        {/* Biometric Checkout */}
        <BiometricCheckout />

        {/* Featured Games Mobile Optimized */}
        <div className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Game Trending
              </h3>
              <Button variant="ghost" size="sm" className="text-primary">
                Lihat Semua
                <Icon name="ArrowRight" size={16} className="ml-1" />
              </Button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {featuredGames?.map((game) => (
              <div
                key={game?.id}
                className="bg-surface rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-200"
              >
                <div className="relative">
                  <Image
                    src={game?.image}
                    alt={game?.name}
                    className="w-full h-32 object-cover"
                  />
                  {game?.trending && (
                    <div className="absolute top-2 left-2 bg-gaming-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                      TRENDING
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                    <Icon name="Star" size={12} className="text-gaming-gold" />
                    <span>{game?.rating}</span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-foreground truncate">
                      {game?.name}
                    </h4>
                    <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded-full">
                      {game?.category}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={14} className="text-text-secondary" />
                      <span className="text-xs text-text-secondary">{game?.players}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="TrendingUp" size={14} className="text-success" />
                      <span className="text-xs text-success">Populer</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {game?.packages?.map((pkg, index) => (
                      <Button
                        key={index}
                        variant={pkg?.popular ? "default" : "outline"}
                        size="sm"
                        className={pkg?.popular ? "bg-gradient-to-r from-primary to-secondary" : "border-primary/30 text-primary"}
                      >
                        <div className="text-center">
                          <p className="text-xs">
                            {pkg?.diamonds ? `${pkg?.diamonds} Diamond` : `${pkg?.uc} UC`}
                          </p>
                          <p className="font-bold">{pkg?.price}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notification Center */}
        <PushNotificationCenter />

        {/* Offline Mode Indicator */}
        <OfflineModeIndicator />

        {/* Gesture Controls */}
        <GestureControls />

        {/* Mobile Optimization Tips */}
        <div className="bg-card rounded-2xl shadow-gaming border border-border p-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Lightbulb" size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Tips Mobile Gaming
              </h3>
              <p className="text-xs text-text-secondary">
                Maksimalkan pengalaman gaming Anda
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <Icon name="Battery" size={16} className="text-success mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Hemat Baterai
                </p>
                <p className="text-xs text-text-secondary">
                  Aktifkan mode hemat daya saat bermain game berat
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <Icon name="Wifi" size={16} className="text-primary mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Koneksi Stabil
                </p>
                <p className="text-xs text-text-secondary">
                  Gunakan WiFi untuk top-up dan download game
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-surface rounded-lg">
              <Icon name="Shield" size={16} className="text-gaming-gold mt-1" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Keamanan Akun
                </p>
                <p className="text-xs text-text-secondary">
                  Aktifkan autentikasi 2 faktor untuk keamanan maksimal
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MobileGamingExperience;