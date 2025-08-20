import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useGame } from '../../../contexts/GameContext';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const { isAuthenticated, profile } = useAuth();
  const { games, promotions, systemSettings, loading } = useGame();
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  // Initialize with fallback games immediately
  const [featuredGames, setFeaturedGames] = useState([
    {
      id: 'fallback-1',
      name: "Mobile Legends",
      slug: "mobile-legends",
      icon: "⚔️",
      color: "from-blue-500 to-purple-600",
      category: "MOBA",
      players: "100M+",
      rating: 4.8,
      reviewCount: 125000,
      processingSpeed: 'instant',
      packages: [
        { amount: "86 Diamonds", price: 20000, popular: false },
        { amount: "172 Diamonds", price: 40000, popular: true },
        { amount: "257 Diamonds", price: 60000, popular: false },
        { amount: "344 Diamonds", price: 80000, popular: false }
      ],
      features: ["Instan Delivery", "Best Price", "24/7 Support"],
      hasPromo: true
    },
    {
      id: 'fallback-2',
      name: "Free Fire",
      slug: "free-fire",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      category: "Battle Royale",
      players: "80M+",
      rating: 4.6,
      reviewCount: 87000,
      processingSpeed: 'instant',
      packages: [
        { amount: "70 Diamonds", price: 10000, popular: false },
        { amount: "140 Diamonds", price: 20000, popular: true },
        { amount: "355 Diamonds", price: 50000, popular: false },
        { amount: "720 Diamonds", price: 100000, popular: false }
      ],
      features: ["Auto Process", "Secure Payment", "Instant Refund"],
      hasPromo: false
    },
    {
      id: 'fallback-3',
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      icon: "🎯",
      color: "from-yellow-500 to-orange-600",
      category: "Battle Royale",
      players: "50M+",
      rating: 4.7,
      reviewCount: 98000,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 UC", price: 15000, popular: false },
        { amount: "325 UC", price: 75000, popular: true },
        { amount: "660 UC", price: 150000, popular: false },
        { amount: "1800 UC", price: 400000, popular: false }
      ],
      features: ["Fast Delivery", "Verified Seller", "Money Back"],
      hasPromo: false
    },
    {
      id: 'fallback-4',
      name: "Genshin Impact",
      slug: "genshin-impact",
      icon: "✨",
      color: "from-purple-500 to-pink-600",
      category: "RPG",
      players: "60M+",
      rating: 4.9,
      reviewCount: 156000,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 Genesis", price: 16000, popular: false },
        { amount: "300 Genesis", price: 79000, popular: true },
        { amount: "980 Genesis", price: 249000, popular: false },
        { amount: "1980 Genesis", price: 499000, popular: false }
      ],
      features: ["Premium Service", "VIP Support", "Bonus Rewards"],
      hasPromo: false
    }
  ]);
  const [liveStats, setLiveStats] = useState({
    activeUsers: systemSettings?.total_games ? `${systemSettings.total_games}+` : '150+',
    todayTransactions: '15.2K',
    avgProcessTime: '28s',
    successRate: systemSettings?.success_rate || '99.9%'
  });

  // Transform Supabase games data to featured games format
  const transformSupabaseGames = (supabaseGames) => {
    const gameIconMap = {
      'mobile-legends': { icon: "⚔️", color: "from-blue-500 to-purple-600", players: "100M+" },
      'free-fire': { icon: "🔥", color: "from-orange-500 to-red-600", players: "80M+" },
      'pubg-mobile': { icon: "🎯", color: "from-yellow-500 to-orange-600", players: "50M+" },
      'genshin-impact': { icon: "✨", color: "from-purple-500 to-pink-600", players: "60M+" },
      'arena-of-valor': { icon: "⚔️", color: "from-indigo-500 to-purple-600", players: "45M+" },
      'call-of-duty-mobile': { icon: "🎯", color: "from-gray-500 to-blue-600", players: "35M+" },
      'clash-of-clans': { icon: "🏰", color: "from-yellow-500 to-red-600", players: "40M+" },
      'honkai-impact-3rd': { icon: "✨", color: "from-pink-500 to-purple-600", players: "30M+" }
    };

    const categoryFeatures = {
      'moba': ["Instan Delivery", "Best Price", "24/7 Support"],
      'battle-royale': ["Auto Process", "Secure Payment", "Instant Refund"],
      'rpg': ["Premium Service", "VIP Support", "Bonus Rewards"],
      'strategy': ["Fast Delivery", "Verified Seller", "Money Back"],
      'fps': ["Quick Process", "Safe Payment", "Live Support"]
    };

    return supabaseGames
      .filter(game => game.is_popular && game.is_active)
      .slice(0, 4)
      .map(game => {
        const gameInfo = gameIconMap[game.slug] || { 
          icon: "🎮", 
          color: "from-primary to-secondary", 
          players: "10M+" 
        };
        
        // Transform packages from Supabase format
        const packages = game.game_packages 
          ? game.game_packages
              .filter(pkg => pkg.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .slice(0, 4)
              .map(pkg => ({
                amount: pkg.amount,
                price: pkg.price,
                popular: pkg.is_popular || false
              }))
          : [];

        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          icon: gameInfo.icon,
          color: gameInfo.color,
          category: game.category.charAt(0).toUpperCase() + game.category.slice(1).replace('-', ' '),
          players: gameInfo.players,
          rating: game.rating || 4.5,
          reviewCount: game.review_count || 0,
          processingSpeed: game.processing_speed,
          packages: packages,
          features: categoryFeatures[game.category] || ["Fast Process", "Secure Payment", "24/7 Support"],
          hasPromo: promotions.some(promo => promo.game_id === game.id && promo.is_active)
        };
      });
  };

  // Fallback games data when Supabase is not available
  const fallbackGames = [
    {
      id: 'fallback-1',
      name: "Mobile Legends",
      slug: "mobile-legends",
      icon: "⚔️",
      color: "from-blue-500 to-purple-600",
      category: "MOBA",
      players: "100M+",
      rating: 4.8,
      reviewCount: 125000,
      processingSpeed: 'instant',
      packages: [
        { amount: "86 Diamonds", price: 20000, popular: false },
        { amount: "172 Diamonds", price: 40000, popular: true },
        { amount: "257 Diamonds", price: 60000, popular: false },
        { amount: "344 Diamonds", price: 80000, popular: false }
      ],
      features: ["Instan Delivery", "Best Price", "24/7 Support"],
      hasPromo: true
    },
    {
      id: 'fallback-2',
      name: "Free Fire",
      slug: "free-fire",
      icon: "🔥",
      color: "from-orange-500 to-red-600",
      category: "Battle Royale",
      players: "80M+",
      rating: 4.6,
      reviewCount: 87000,
      processingSpeed: 'instant',
      packages: [
        { amount: "70 Diamonds", price: 10000, popular: false },
        { amount: "140 Diamonds", price: 20000, popular: true },
        { amount: "355 Diamonds", price: 50000, popular: false },
        { amount: "720 Diamonds", price: 100000, popular: false }
      ],
      features: ["Auto Process", "Secure Payment", "Instant Refund"],
      hasPromo: false
    },
    {
      id: 'fallback-3',
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      icon: "🎯",
      color: "from-yellow-500 to-orange-600",
      category: "Battle Royale",
      players: "50M+",
      rating: 4.7,
      reviewCount: 98000,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 UC", price: 15000, popular: false },
        { amount: "325 UC", price: 75000, popular: true },
        { amount: "660 UC", price: 150000, popular: false },
        { amount: "1800 UC", price: 400000, popular: false }
      ],
      features: ["Fast Delivery", "Verified Seller", "Money Back"],
      hasPromo: false
    },
    {
      id: 'fallback-4',
      name: "Genshin Impact",
      slug: "genshin-impact",
      icon: "✨",
      color: "from-purple-500 to-pink-600",
      category: "RPG",
      players: "60M+",
      rating: 4.9,
      reviewCount: 156000,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 Genesis", price: 16000, popular: false },
        { amount: "300 Genesis", price: 79000, popular: true },
        { amount: "980 Genesis", price: 249000, popular: false },
        { amount: "1980 Genesis", price: 499000, popular: false }
      ],
      features: ["Premium Service", "VIP Support", "Bonus Rewards"],
      hasPromo: false
    }
  ];

  // Update featured games when Supabase data changes
  useEffect(() => {
    console.log('HeroSection: Loading state:', loading);
    console.log('HeroSection: Games data:', games?.length || 0, 'games');
    console.log('HeroSection: Promotions data:', promotions?.length || 0, 'promotions');
    
    if (games && games.length > 0) {
      const transformedGames = transformSupabaseGames(games);
      console.log('HeroSection: Transformed games:', transformedGames.length);
      if (transformedGames.length > 0) {
        setFeaturedGames(transformedGames);
        console.log('HeroSection: Using Supabase data');
      } else {
        // If no popular games found, use fallback
        setFeaturedGames(fallbackGames);
        console.log('HeroSection: No popular games, using fallback');
      }
    } else {
      // Always use fallback if no games data
      setFeaturedGames(fallbackGames);
      console.log('HeroSection: No games data, using fallback');
    }
  }, [games, promotions, loading]);

  // Update live stats from system settings
  useEffect(() => {
    if (systemSettings) {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: systemSettings.total_games ? `${systemSettings.total_games}+` : '150+',
        successRate: systemSettings.success_rate || '99.9%'
      }));
    }
  }, [systemSettings]);

  // Key features that rotate
  const keyFeatures = [
    {
      icon: "Shield",
      title: "100% Keamanan Terjamin",
      description: "Sistem enkripsi SSL 256-bit dan partnership resmi dengan developer game",
      color: "text-green-500"
    },
    {
      icon: "Zap",
      title: "Proses Super Cepat",
      description: "Rata-rata 30 detik, tercepat 5 detik dengan teknologi auto-processing",
      color: "text-primary"
    },
    {
      icon: "DollarSign",
      title: "Harga Terbaik Dijamin",
      description: "Price matching guarantee dan cashback hingga 5% untuk member VIP",
      color: "text-gaming-gold"
    },
    {
      icon: "Headphones",
      title: "Customer Service 24/7",
      description: "Tim support profesional siap membantu via WhatsApp, Live Chat, dan Email",
      color: "text-secondary"
    }
  ];

  // Rotate featured games
  useEffect(() => {
    if (featuredGames.length > 0) {
      const interval = setInterval(() => {
        setCurrentGameIndex((prev) => (prev + 1) % featuredGames.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [featuredGames.length]);

  // Rotate key features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % keyFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulate live stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        todayTransactions: `${(15.2 + Math.random() * 0.1).toFixed(1)}K`,
        avgProcessTime: `${Math.floor(25 + Math.random() * 10)}s`
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentGame = featuredGames.length > 0 ? featuredGames[currentGameIndex] : null;
  const currentFeature = keyFeatures[currentFeatureIndex];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-surface/20 to-background">
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
                                  radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`
               }}>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-3 h-3 bg-primary/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-2 h-2 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-gaming-gold/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-10 w-2 h-2 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]" 
             style={{
               backgroundImage: `linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px'
             }}>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-screen py-20">
          
          {/* Left Content - Main Hero */}
          <div className="lg:col-span-7 text-left space-y-8">
            {/* Live Status Badge */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live: {liveStats.todayTransactions} transaksi hari ini</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-medium backdrop-blur-sm">
                <Icon name="TrendingUp" size={14} />
                <span>#1 Platform Indonesia</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl hero-title leading-tight">
                <span className="block text-foreground">Top Up Gaming</span>
                <span className="block text-gaming-gradient">Terpercaya & Terdepan</span>
              </h1>
              
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed max-w-2xl font-content">
                Platform top-up gaming #1 di Indonesia dengan teknologi auto-processing, keamanan bank-grade, dan customer service 24/7. Melayani 150+ game dengan success rate 99.94%.
              </p>
            </div>

            {/* Key Feature Highlight - Rotating */}
            <div className="p-6 bg-gradient-to-r from-surface/30 to-surface/10 rounded-2xl border border-border/30 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${currentFeature.color}`}>
                  <Icon name={currentFeature.icon} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                    {currentFeature.title}
                  </h3>
                  <p className="text-text-secondary text-sm font-content leading-relaxed">
                    {currentFeature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/game-selection-hub">
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow transform hover:scale-105 transition-all duration-300 font-gaming font-semibold"
                >
                  <Icon name="Zap" size={20} className="mr-2" />
                  {isAuthenticated ? `Halo ${profile?.username || 'User'}, Mulai Top Up` : 'Mulai Top Up Sekarang'}
                </Button>
              </Link>
              
              <Link to="/game-selection-hub">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-border/50 text-foreground hover:bg-surface/30 hover:border-primary/30 transition-all duration-300 font-ui"
                >
                  <Icon name="Search" size={20} className="mr-2" />
                  Cari Game Favorit
                </Button>
              </Link>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
              <div className="text-center p-4 bg-surface/20 rounded-xl border border-border/30">
                <div className="text-2xl font-gaming font-bold text-primary mb-1">{liveStats.activeUsers}</div>
                <div className="text-xs text-text-secondary font-ui">Active Users</div>
              </div>
              <div className="text-center p-4 bg-surface/20 rounded-xl border border-border/30">
                <div className="text-2xl font-gaming font-bold text-secondary mb-1">{liveStats.successRate}</div>
                <div className="text-xs text-text-secondary font-ui">Success Rate</div>
              </div>
              <div className="text-center p-4 bg-surface/20 rounded-xl border border-border/30">
                <div className="text-2xl font-gaming font-bold text-gaming-gold mb-1">{liveStats.avgProcessTime}</div>
                <div className="text-xs text-text-secondary font-ui">Avg. Process</div>
              </div>
              <div className="text-center p-4 bg-surface/20 rounded-xl border border-border/30">
                <div className="text-2xl font-gaming font-bold text-green-500 mb-1">150+</div>
                <div className="text-xs text-text-secondary font-ui">Games</div>
              </div>
            </div>
          </div>

          {/* Right Content - Comprehensive Game Showcase */}
          <div className="lg:col-span-5 space-y-6">
            {currentGame ? (
              <>
                {/* Main Game Card */}
                <div className="gaming-card p-6 backdrop-blur-md bg-card/80 border border-border/50 shadow-gaming-lg">
                  <div className="space-y-6">
                    {/* Game Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentGame.color} flex items-center justify-center text-xl transform transition-all duration-500`}>
                          {currentGame.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-gaming font-bold text-foreground">
                            {currentGame.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <span>{currentGame.category}</span>
                            <span>•</span>
                            <span>{currentGame.players} players</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-text-secondary">Starting from</div>
                        <div className="text-lg font-gaming font-bold text-primary">
                          {currentGame.packages && currentGame.packages.length > 0 ? (
                            `Rp ${currentGame.packages[0].price.toLocaleString('id-ID')}`
                          ) : (
                            'Rp 10.000'
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Game Features */}
                    <div className="grid grid-cols-3 gap-3">
                      {currentGame.features && currentGame.features.map((feature, index) => (
                        <div key={index} className="text-center p-3 bg-surface/20 rounded-lg">
                          <div className="text-xs text-text-secondary">{feature}</div>
                        </div>
                      ))}
                    </div>

                    {/* Package Options */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-gaming font-semibold text-foreground">Popular Packages</h4>
                        <Link to="/game-selection-hub" className="text-xs text-primary hover:text-primary/80 transition-colors">
                          View All →
                        </Link>
                      </div>
                      {currentGame.packages && currentGame.packages.slice(0, 3).map((pkg, index) => (
                        <div key={index} className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 hover:bg-surface/40 ${
                          pkg.popular ? 'bg-primary/10 border border-primary/20' : 'bg-surface/20'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-ui text-foreground">{pkg.amount}</span>
                            {pkg.popular && (
                              <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-gaming font-semibold text-primary">
                              Rp {pkg.price.toLocaleString('id-ID')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Action */}
                    <Link to="/game-selection-hub">
                      <Button 
                        variant="default" 
                        fullWidth
                        className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow transition-all duration-300 font-gaming font-semibold"
                      >
                        <Icon name="ShoppingCart" size={18} className="mr-2" />
                        Top Up {currentGame.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              /* Loading State */
              <div className="gaming-card p-6 backdrop-blur-md bg-card/80 border border-border/50 shadow-gaming-lg">
                <div className="space-y-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-surface/50"></div>
                      <div>
                        <div className="h-5 bg-surface/50 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-surface/50 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-3 bg-surface/50 rounded w-16 mb-1"></div>
                      <div className="h-5 bg-surface/50 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 bg-surface/20 rounded-lg">
                        <div className="h-3 bg-surface/50 rounded"></div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-surface/50 rounded w-32 mb-3"></div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-surface/20 rounded-lg">
                        <div className="h-3 bg-surface/50 rounded w-20"></div>
                        <div className="h-3 bg-surface/50 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-12 bg-surface/50 rounded-lg"></div>
                </div>
              </div>
            )}

            {/* Payment Methods Preview */}
            <div className="gaming-card p-4 backdrop-blur-md bg-card/60 border border-border/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-gaming font-semibold text-foreground">Payment Methods</h4>
                  <span className="text-xs text-text-secondary">20+ options</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="p-2 bg-surface/20 rounded-lg text-center">
                    <div className="text-xs text-text-secondary">💳</div>
                    <div className="text-xs text-text-secondary mt-1">E-Wallet</div>
                  </div>
                  <div className="p-2 bg-surface/20 rounded-lg text-center">
                    <div className="text-xs text-text-secondary">🏦</div>
                    <div className="text-xs text-text-secondary mt-1">Bank</div>
                  </div>
                  <div className="p-2 bg-surface/20 rounded-lg text-center">
                    <div className="text-xs text-text-secondary">🏪</div>
                    <div className="text-xs text-text-secondary mt-1">Retail</div>
                  </div>
                  <div className="p-2 bg-surface/20 rounded-lg text-center">
                    <div className="text-xs text-text-secondary">📱</div>
                    <div className="text-xs text-text-secondary mt-1">QRIS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="gaming-card p-4 backdrop-blur-md bg-card/60 border border-border/30">
              <div className="space-y-4">
                <h4 className="text-sm font-gaming font-semibold text-foreground">How It Works</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
                    <span className="text-xs text-text-secondary">Pilih game & package</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">2</div>
                    <span className="text-xs text-text-secondary">Masukkan User ID</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary">3</div>
                    <span className="text-xs text-text-secondary">Bayar & terima instan</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="gaming-card p-4 backdrop-blur-md bg-card/60 border border-border/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-gaming font-bold text-gaming-gold">4.9/5</div>
                  <div className="text-xs text-text-secondary">Customer Rating</div>
                </div>
                <div>
                  <div className="text-lg font-gaming font-bold text-secondary">50K+</div>
                  <div className="text-xs text-text-secondary">Reviews</div>
                </div>
                <div>
                  <div className="text-lg font-gaming font-bold text-green-500">99.8%</div>
                  <div className="text-xs text-text-secondary">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Bottom Section - Social Proof */}
        <div className="text-center pb-12">
          <p className="text-text-secondary text-sm mb-6 font-ui">Dipercaya oleh gamer dari berbagai komunitas</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-sm font-ui">EVOS Esports</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Trophy" size={16} className="text-secondary" />
              <span className="text-sm font-ui">RRQ Team</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Star" size={16} className="text-gaming-gold" />
              <span className="text-sm font-ui">ONIC Esports</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Gamepad2" size={16} className="text-green-500" />
              <span className="text-sm font-ui">Bigetron Alpha</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text-secondary/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;