import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import DashboardHeader from './components/DashboardHeader';
import QuickActions from './components/QuickActions';
import TransactionHistory from './components/TransactionHistory';
import WishlistManager from './components/WishlistManager';
import GamingAnalytics from './components/GamingAnalytics';
import SocialFeatures from './components/SocialFeatures';
import LoyaltyProgram from './components/LoyaltyProgram';
import SecuritySettings from './components/SecuritySettings';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PersonalGamingDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('id');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'id';
    setCurrentLanguage(savedLanguage);
  }, []);

  // Mock user data
  const userData = {
    id: 1,
    name: "Ahmad Rizki",
    email: "ahmad.rizki@email.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    level: 25,
    tier: "Gold",
    joinDate: "15/03/2023",
    lastLogin: "19/08/2025 16:45"
  };

  const statsData = {
    totalTopups: 127,
    favoriteGames: 8,
    totalSpent: 15750000
  };

  const favoriteGames = [
    {
      id: 1,
      name: "Mobile Legends",
      icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      lastTopup: "2 hari lalu"
    },
    {
      id: 2,
      name: "Free Fire",
      icon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      lastTopup: "1 minggu lalu"
    },
    {
      id: 3,
      name: "PUBG Mobile",
      icon: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop",
      lastTopup: "3 hari lalu"
    },
    {
      id: 4,
      name: "Genshin Impact",
      icon: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      lastTopup: "5 hari lalu"
    }
  ];

  const transactionHistory = [
    {
      id: "TXN001",
      gameName: "Mobile Legends",
      gameIcon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      package: "275 Diamonds",
      amount: 75000,
      method: "Dana",
      status: "success",
      date: "2025-08-19T10:30:00Z"
    },
    {
      id: "TXN002",
      gameName: "Free Fire",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      package: "1080 Diamonds",
      amount: 250000,
      method: "OVO",
      status: "success",
      date: "2025-08-18T14:15:00Z"
    },
    {
      id: "TXN003",
      gameName: "PUBG Mobile",
      gameIcon: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop",
      package: "1800 UC",
      amount: 350000,
      method: "GoPay",
      status: "pending",
      date: "2025-08-17T09:20:00Z"
    },
    {
      id: "TXN004",
      gameName: "Genshin Impact",
      gameIcon: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      package: "6480 Genesis Crystals",
      amount: 1500000,
      method: "Bank Transfer",
      status: "failed",
      date: "2025-08-16T16:45:00Z"
    },
    {
      id: "TXN005",
      gameName: "Mobile Legends",
      gameIcon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      package: "568 Diamonds",
      amount: 150000,
      method: "ShopeePay",
      status: "success",
      date: "2025-08-15T11:30:00Z"
    },
    {
      id: "TXN006",
      gameName: "Valorant",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      package: "2150 VP",
      amount: 200000,
      method: "Dana",
      status: "success",
      date: "2025-08-14T13:20:00Z"
    }
  ];

  const wishlistItems = [
    {
      id: 1,
      gameName: "Mobile Legends",
      gameIcon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      packageName: "1159 Diamonds",
      currentPrice: 300000,
      originalPrice: 350000,
      isOnSale: true
    },
    {
      id: 2,
      gameName: "Free Fire",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      packageName: "2180 Diamonds",
      currentPrice: 500000,
      originalPrice: 500000,
      isOnSale: false
    },
    {
      id: 3,
      gameName: "PUBG Mobile",
      gameIcon: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop",
      packageName: "3850 UC",
      currentPrice: 750000,
      originalPrice: 850000,
      isOnSale: true
    },
    {
      id: 4,
      gameName: "Genshin Impact",
      gameIcon: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop",
      packageName: "8080 Genesis Crystals",
      currentPrice: 1800000,
      originalPrice: 2000000,
      isOnSale: true
    },
    {
      id: 5,
      gameName: "Valorant",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      packageName: "5350 VP",
      currentPrice: 500000,
      originalPrice: 500000,
      isOnSale: false
    }
  ];

  const analyticsData = {
    monthlySpending: [
      { month: "Jan", amount: 1200000 },
      { month: "Feb", amount: 1500000 },
      { month: "Mar", amount: 1800000 },
      { month: "Apr", amount: 1300000 },
      { month: "May", amount: 2100000 },
      { month: "Jun", amount: 1900000 },
      { month: "Jul", amount: 2300000 },
      { month: "Aug", amount: 1750000 }
    ],
    spendingByCategory: [
      { name: "MOBA Games", value: 6500000 },
      { name: "Battle Royale", value: 4200000 },
      { name: "RPG Games", value: 3100000 },
      { name: "FPS Games", value: 1950000 }
    ],
    insights: {
      averageMonthly: 1750000,
      savedThisMonth: 250000,
      favoriteTime: "19:00 - 21:00"
    },
    topGames: [
      { name: "Mobile Legends", transactions: 45, totalSpent: 6500000 },
      { name: "Free Fire", transactions: 32, totalSpent: 4200000 },
      { name: "PUBG Mobile", transactions: 28, totalSpent: 3800000 },
      { name: "Genshin Impact", transactions: 15, totalSpent: 3100000 },
      { name: "Valorant", transactions: 7, totalSpent: 1950000 }
    ],
    dailyPatterns: [
      { hour: "00", purchases: 2 },
      { hour: "06", purchases: 5 },
      { hour: "12", purchases: 15 },
      { hour: "18", purchases: 35 },
      { hour: "21", purchases: 28 },
      { hour: "24", purchases: 8 }
    ],
    weeklyPatterns: [
      { day: "Sen", activity: 12 },
      { day: "Sel", activity: 18 },
      { day: "Rab", activity: 15 },
      { day: "Kam", activity: 22 },
      { day: "Jum", activity: 35 },
      { day: "Sab", activity: 45 },
      { day: "Min", activity: 38 }
    ],
    recommendations: [
      {
        icon: "TrendingDown",
        title: "Hemat 15% dengan Bundle",
        description: "Beli paket bundle untuk game favorit Anda dan hemat lebih banyak"
      },
      {
        icon: "Clock",
        title: "Waktu Optimal Pembelian",
        description: "Beli pada jam 19-21 untuk mendapat bonus poin ekstra"
      },
      {
        icon: "Target",
        title: "Capai Gold Tier",
        description: "Tambah Rp 250.000 lagi untuk naik ke tier Platinum"
      },
      {
        icon: "Gift",
        title: "Promo Weekend",
        description: "Dapatkan cashback 10% untuk pembelian di akhir pekan"
      }
    ]
  };

  const socialData = {
    friends: [
      {
        id: 1,
        name: "Budi Santoso",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        level: 22,
        favoriteGame: "Mobile Legends",
        isOnline: true,
        lastSeen: ""
      },
      {
        id: 2,
        name: "Sari Dewi",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        level: 18,
        favoriteGame: "Free Fire",
        isOnline: false,
        lastSeen: "2 jam lalu"
      },
      {
        id: 3,
        name: "Andi Pratama",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        level: 30,
        favoriteGame: "PUBG Mobile",
        isOnline: true,
        lastSeen: ""
      },
      {
        id: 4,
        name: "Maya Sari",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        level: 15,
        favoriteGame: "Genshin Impact",
        isOnline: false,
        lastSeen: "1 hari lalu"
      }
    ],
    achievements: [
      {
        id: 1,
        title: "First Purchase",
        description: "Lakukan pembelian pertama",
        icon: "ShoppingCart",
        unlocked: true,
        unlockedDate: "15/03/2023",
        progress: 100
      },
      {
        id: 2,
        title: "Big Spender",
        description: "Belanja lebih dari Rp 10.000.000",
        icon: "CreditCard",
        unlocked: true,
        unlockedDate: "20/07/2024",
        progress: 100
      },
      {
        id: 3,
        title: "Loyal Customer",
        description: "Berbelanja selama 1 tahun berturut-turut",
        icon: "Calendar",
        unlocked: true,
        unlockedDate: "15/03/2024",
        progress: 100
      },
      {
        id: 4,
        title: "Game Master",
        description: "Top up untuk 10 game berbeda",
        icon: "Gamepad2",
        unlocked: false,
        progress: 80
      },
      {
        id: 5,
        title: "Social Butterfly",
        description: "Ajak 5 teman bergabung",
        icon: "Users",
        unlocked: false,
        progress: 60
      },
      {
        id: 6,
        title: "Speed Demon",
        description: "Selesaikan 100 transaksi dalam sebulan",
        icon: "Zap",
        unlocked: false,
        progress: 25
      }
    ],
    challenges: [
      {
        id: 1,
        title: "Weekend Warrior",
        description: "Lakukan 5 top-up di akhir pekan",
        icon: "Target",
        reward: "Bonus 500 Poin",
        currentProgress: 3,
        targetProgress: 5,
        endDate: "25/08/2025",
        participants: 1247,
        active: true
      },
      {
        id: 2,
        title: "Mobile Legends Master",
        description: "Top up Mobile Legends 10 kali bulan ini",
        icon: "Gamepad2",
        reward: "Skin Eksklusif",
        currentProgress: 7,
        targetProgress: 10,
        endDate: "31/08/2025",
        participants: 892,
        active: true
      },
      {
        id: 3,
        title: "Refer a Friend",
        description: "Ajak 3 teman baru bergabung",
        icon: "UserPlus",
        reward: "Cashback Rp 100.000",
        currentProgress: 1,
        targetProgress: 3,
        endDate: "15/09/2025",
        participants: 2156,
        active: true
      }
    ]
  };

  const loyaltyData = {
    totalSpent: 15750000,
    points: 3150,
    currentBenefits: [
      "Cashback 2% untuk setiap transaksi",
      "Akses early bird untuk promo baru",
      "Customer service prioritas",
      "Gratis biaya admin untuk semua metode pembayaran"
    ]
  };

  const rewards = [
    {
      id: 1,
      name: "Cashback Rp 50.000",
      points: 1000,
      icon: "DollarSign"
    },
    {
      id: 2,
      name: "Bonus 10% Top Up",
      points: 1500,
      icon: "Gift"
    },
    {
      id: 3,
      name: "Skin Game Eksklusif",
      points: 2500,
      icon: "Star"
    },
    {
      id: 4,
      name: "Merchandise WMX",
      points: 3000,
      icon: "Package"
    }
  ];

  const exclusiveOffers = [
    {
      id: 1,
      title: "Paket Hemat Mobile Legends",
      gameName: "Mobile Legends",
      gameIcon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      originalPrice: 500000,
      discountedPrice: 400000,
      discount: 20,
      timeLeft: "2 hari lagi"
    },
    {
      id: 2,
      title: "Bundle Free Fire Premium",
      gameName: "Free Fire",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop",
      originalPrice: 750000,
      discountedPrice: 600000,
      discount: 20,
      timeLeft: "5 hari lagi"
    }
  ];

  const securityData = {
    hasStrongPassword: true,
    twoFactorEnabled: true,
    twoFactorMethod: "Google Authenticator",
    emailVerified: true,
    phoneVerified: true,
    lastPasswordChange: "15/07/2025",
    trustedDevices: [
      {
        id: 1,
        name: "iPhone 14 Pro",
        type: "mobile",
        location: "Jakarta, Indonesia",
        lastActive: "Sekarang",
        isCurrent: true
      },
      {
        id: 2,
        name: "MacBook Pro",
        type: "desktop",
        location: "Jakarta, Indonesia",
        lastActive: "2 jam lalu",
        isCurrent: false
      },
      {
        id: 3,
        name: "Samsung Galaxy S23",
        type: "mobile",
        location: "Bandung, Indonesia",
        lastActive: "1 minggu lalu",
        isCurrent: false
      }
    ],
    recentActivity: []
  };

  const dashboardTabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'Home' },
    { id: 'transactions', label: 'Transaksi', icon: 'CreditCard' },
    { id: 'wishlist', label: 'Wishlist', icon: 'Heart' },
    { id: 'analytics', label: 'Analitik', icon: 'BarChart3' },
    { id: 'social', label: 'Sosial', icon: 'Users' },
    { id: 'loyalty', label: 'Loyalitas', icon: 'Crown' },
    { id: 'security', label: 'Keamanan', icon: 'Shield' }
  ];

  const handleGameSelect = (game) => {
    console.log('Selected game:', game);
  };

  const handleRemoveWishlistItem = (itemId) => {
    console.log('Remove wishlist item:', itemId);
  };

  const handlePriceAlert = (itemId, enabled) => {
    console.log('Price alert:', itemId, enabled);
  };

  const handleSecurityUpdate = (data) => {
    console.log('Security update:', data);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <QuickActions 
              favoriteGames={favoriteGames}
              onGameSelect={handleGameSelect}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <TransactionHistory transactions={transactionHistory?.slice(0, 3)} />
              <WishlistManager 
                wishlistItems={wishlistItems?.slice(0, 2)}
                onRemoveItem={handleRemoveWishlistItem}
                onPriceAlert={handlePriceAlert}
              />
            </div>
          </div>
        );
      case 'transactions':
        return (
          <TransactionHistory 
            transactions={transactionHistory}
          />
        );
      case 'wishlist':
        return (
          <WishlistManager 
            wishlistItems={wishlistItems}
            onRemoveItem={handleRemoveWishlistItem}
            onPriceAlert={handlePriceAlert}
          />
        );
      case 'analytics':
        return (
          <GamingAnalytics 
            analyticsData={analyticsData}
          />
        );
      case 'social':
        return (
          <SocialFeatures 
            friends={socialData?.friends}
            achievements={socialData?.achievements}
            challenges={socialData?.challenges}
          />
        );
      case 'loyalty':
        return (
          <LoyaltyProgram 
            loyaltyData={loyaltyData}
            rewards={rewards}
            exclusiveOffers={exclusiveOffers}
          />
        );
      case 'security':
        return (
          <SecuritySettings 
            securityData={securityData}
            onSecurityUpdate={handleSecurityUpdate}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Dashboard Header */}
          <DashboardHeader 
            user={userData}
            stats={statsData}
          />

          {/* Dashboard Navigation */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
            <div className="flex flex-wrap gap-2">
              {dashboardTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-neon-blue'
                      : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span className="font-medium">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Quick Support */}
          <div className="fixed bottom-6 right-6 z-40">
            <Button
              variant="default"
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary shadow-gaming-lg hover:shadow-neon-glow rounded-full w-14 h-14 p-0"
            >
              <Icon name="MessageCircle" size={24} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalGamingDashboard;