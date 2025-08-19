import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import TrendingSection from './components/TrendingSection';
import RecommendedSection from './components/RecommendedSection';
import PromoSection from './components/PromoSection';
import GameCard from './components/GameCard';

const GameSelectionHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sortBy: 'popular',
    priceRange: null,
    processingSpeed: [],
    hasPromo: false
  });
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for categories
  const categories = [
    { id: 'all', name: 'Semua Game', icon: 'Grid3X3', count: 150 },
    { id: 'moba', name: 'MOBA', icon: 'Sword', count: 25 },
    { id: 'battle-royale', name: 'Battle Royale', icon: 'Target', count: 18 },
    { id: 'rpg', name: 'RPG', icon: 'Shield', count: 32 },
    { id: 'strategy', name: 'Strategy', icon: 'Brain', count: 22 },
    { id: 'racing', name: 'Racing', icon: 'Car', count: 15 },
    { id: 'sports', name: 'Sports', icon: 'Trophy', count: 12 },
    { id: 'casual', name: 'Casual', icon: 'Gamepad2', count: 26 }
  ];

  // Mock data for trending games
  const trendingGames = [
    {
      id: 1,
      name: "Mobile Legends: Bang Bang",
      category: "MOBA",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 125000,
      isPopular: true,
      hasPromo: true,
      processingSpeed: 'instant',
      packages: [
        { amount: "86 Diamonds", price: 20000 },
        { amount: "172 Diamonds", price: 40000 },
        { amount: "257 Diamonds", price: 60000 },
        { amount: "344 Diamonds", price: 80000 }
      ],
      topReview: {
        username: "GamerPro123",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        comment: "Top up cepat banget, langsung masuk ke akun. Recommended!"
      }
    },
    {
      id: 2,
      name: "PUBG Mobile",
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 98000,
      isPopular: true,
      hasPromo: false,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 UC", price: 15000 },
        { amount: "325 UC", price: 75000 },
        { amount: "660 UC", price: 150000 },
        { amount: "1800 UC", price: 400000 }
      ],
      topReview: {
        username: "BattleQueen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        comment: "Pelayanan bagus, harga kompetitif. Sudah langganan di sini."
      }
    },
    {
      id: 3,
      name: "Free Fire",
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 87000,
      isPopular: true,
      hasPromo: true,
      processingSpeed: 'instant',
      packages: [
        { amount: "70 Diamonds", price: 10000 },
        { amount: "140 Diamonds", price: 20000 },
        { amount: "355 Diamonds", price: 50000 },
        { amount: "720 Diamonds", price: 100000 }
      ],
      topReview: {
        username: "FireMaster",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 4,
        comment: "Proses cepat, customer service responsif. Mantap!"
      }
    },
    {
      id: 4,
      name: "Genshin Impact",
      category: "RPG",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      rating: 4.9,
      reviewCount: 156000,
      isPopular: true,
      hasPromo: false,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 Genesis Crystals", price: 16000 },
        { amount: "300 Genesis Crystals", price: 79000 },
        { amount: "980 Genesis Crystals", price: 249000 },
        { amount: "1980 Genesis Crystals", price: 499000 }
      ],
      topReview: {
        username: "TravelerMain",
        avatar: "https://randomuser.me/api/portraits/women/23.jpg",
        rating: 5,
        comment: "Terpercaya banget! Udah top up berkali-kali, selalu aman."
      }
    }
  ];

  // Mock data for recommended games
  const recommendedGames = [
    {
      id: 5,
      name: "Arena of Valor",
      category: "MOBA",
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 45000,
      isPopular: false,
      hasPromo: true,
      processingSpeed: 'instant',
      matchPercentage: 95,
      recommendationReason: "Sesuai dengan preferensi MOBA kamu dan sedang ada promo menarik!",
      packages: [
        { amount: "90 Vouchers", price: 25000 },
        { amount: "180 Vouchers", price: 50000 }
      ],
      topReview: {
        username: "AOVPro",
        avatar: "https://randomuser.me/api/portraits/men/15.jpg",
        rating: 4,
        comment: "Game seru, top up mudah dan cepat."
      }
    },
    {
      id: 6,
      name: "Call of Duty Mobile",
      category: "Battle Royale",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 72000,
      isPopular: false,
      hasPromo: false,
      processingSpeed: 'fast',
      matchPercentage: 88,
      recommendationReason: "Game FPS yang cocok dengan gaya bermain kompetitif kamu.",
      packages: [
        { amount: "80 CP", price: 15000 },
        { amount: "400 CP", price: 75000 }
      ],
      topReview: {
        username: "CODMaster",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg",
        rating: 5,
        comment: "Mantap, proses top up lancar jaya!"
      }
    }
  ];

  // Mock data for all games
  const allGames = [
    ...trendingGames,
    ...recommendedGames,
    {
      id: 7,
      name: "Clash of Clans",
      category: "Strategy",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      rating: 4.4,
      reviewCount: 89000,
      isPopular: false,
      hasPromo: true,
      processingSpeed: 'normal',
      packages: [
        { amount: "500 Gems", price: 75000 },
        { amount: "1200 Gems", price: 150000 }
      ],
      topReview: {
        username: "ClashKing",
        avatar: "https://randomuser.me/api/portraits/men/41.jpg",
        rating: 4,
        comment: "Reliable service, harga oke."
      }
    },
    {
      id: 8,
      name: "Honkai Impact 3rd",
      category: "RPG",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 34000,
      isPopular: false,
      hasPromo: false,
      processingSpeed: 'fast',
      packages: [
        { amount: "60 Crystals", price: 16000 },
        { amount: "330 Crystals", price: 79000 }
      ],
      topReview: {
        username: "HonkaiPlayer",
        avatar: "https://randomuser.me/api/portraits/women/19.jpg",
        rating: 5,
        comment: "Top up aman, customer service ramah."
      }
    }
  ];

  // Mock data for search suggestions
  const searchSuggestions = allGames?.map(game => ({
    name: game?.name,
    category: game?.category,
    icon: game?.image,
    packageCount: game?.packages?.length
  }));

  // Mock data for user preferences
  const userPreferences = {
    favoriteGenres: ['MOBA', 'Battle Royale'],
    averageSpending: 75000,
    playTime: 'Malam (20:00-24:00)'
  };

  // Mock data for promo offers
  const promoOffers = [
    {
      id: 1,
      title: "Flash Sale 50% OFF",
      description: "Dapatkan diskon hingga 50% untuk semua paket Mobile Legends!",
      badge: "FLASH SALE",
      discount: 50,
      originalPrice: 100000,
      discountedPrice: 50000,
      gameName: "Mobile Legends",
      gameImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=300&fit=crop",
      gameIcon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=50&h=50&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop",
      isLimited: true,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000)?.toISOString(),
      shortDescription: "Diskon besar-besaran untuk diamonds!"
    },
    {
      id: 2,
      title: "Weekend Special",
      description: "Bonus 25% diamonds untuk setiap pembelian PUBG Mobile di weekend!",
      badge: "WEEKEND",
      discount: 25,
      originalPrice: 150000,
      discountedPrice: 112500,
      gameName: "PUBG Mobile",
      gameImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=300&fit=crop",
      gameIcon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=50&h=50&fit=crop",
      backgroundImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop",
      isLimited: false,
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)?.toISOString(),
      shortDescription: "Bonus UC untuk weekend gaming!"
    }
  ];

  // Filter and search logic
  useEffect(() => {
    setIsLoading(true);
    
    let filtered = [...allGames];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(game => 
        game?.category?.toLowerCase() === selectedCategory?.toLowerCase()
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered?.filter(game =>
        game?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        game?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    // Price range filter
    if (filters?.priceRange) {
      const priceRanges = {
        'under-50k': { min: 0, max: 50000 },
        '50k-100k': { min: 50000, max: 100000 },
        '100k-250k': { min: 100000, max: 250000 },
        '250k-500k': { min: 250000, max: 500000 },
        'above-500k': { min: 500000, max: Infinity }
      };
      
      const range = priceRanges?.[filters?.priceRange];
      if (range) {
        filtered = filtered?.filter(game => {
          const minPrice = Math.min(...game?.packages?.map(pkg => pkg?.price));
          return minPrice >= range?.min && minPrice <= range?.max;
        });
      }
    }

    // Processing speed filter
    if (filters?.processingSpeed?.length > 0) {
      filtered = filtered?.filter(game =>
        filters?.processingSpeed?.includes(game?.processingSpeed)
      );
    }

    // Promo filter
    if (filters?.hasPromo) {
      filtered = filtered?.filter(game => game?.hasPromo);
    }

    // Sort
    switch (filters?.sortBy) {
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'price-low':
        filtered?.sort((a, b) => {
          const minPriceA = Math.min(...a?.packages?.map(pkg => pkg?.price));
          const minPriceB = Math.min(...b?.packages?.map(pkg => pkg?.price));
          return minPriceA - minPriceB;
        });
        break;
      case 'price-high':
        filtered?.sort((a, b) => {
          const maxPriceA = Math.max(...a?.packages?.map(pkg => pkg?.price));
          const maxPriceB = Math.max(...b?.packages?.map(pkg => pkg?.price));
          return maxPriceB - maxPriceA;
        });
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      default: // popular
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
    }

    setTimeout(() => {
      setFilteredGames(filtered);
      setIsLoading(false);
    }, 300);
  }, [selectedCategory, searchTerm, filters]);

  const handleQuickTopUp = (game) => {
    console.log('Quick top up for:', game?.name);
    // Navigate to checkout with pre-selected game
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'popular',
      priceRange: null,
      processingSpeed: [],
      hasPromo: false
    });
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <>
      <Helmet>
        <title>Game Selection Hub - WMX TOPUP | Premium Gaming Commerce</title>
        <meta name="description" content="Discover and top up your favorite games with WMX TOPUP. Featuring Mobile Legends, PUBG Mobile, Free Fire, and more with instant processing and best prices." />
        <meta name="keywords" content="game top up, mobile legends, pubg mobile, free fire, gaming, indonesia, diamonds, UC, crystals" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-background via-surface/20 to-background py-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Icon name="Gamepad2" size={28} className="text-black" />
                  </div>
                  <h1 className="text-4xl md:text-5xl hero-title text-gaming-gradient">
                    Game Selection Hub
                  </h1>
                </div>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Temukan dan top up game favorit kamu dengan mudah. Proses instan, harga terbaik, dan keamanan terjamin.
                </p>
                
                {/* Quick Stats */}
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-text-secondary">Game Tersedia</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">24/7</div>
                    <div className="text-sm text-text-secondary">Support</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-gold">99.9%</div>
                    <div className="text-sm text-text-secondary">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <SearchBar 
                onSearch={setSearchTerm}
                suggestions={searchSuggestions}
              />
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-6 py-12">
            {/* Promo Section */}
            <PromoSection promoOffers={promoOffers} />

            {/* Trending Section */}
            <TrendingSection 
              trendingGames={trendingGames}
              onQuickTopUp={handleQuickTopUp}
            />

            {/* Recommended Section */}
            <RecommendedSection 
              recommendedGames={recommendedGames}
              onQuickTopUp={handleQuickTopUp}
              userPreferences={userPreferences}
            />

            {/* Category Filter */}
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Filter Panel */}
            <FilterPanel 
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />

            {/* Results Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-gaming font-bold text-foreground">
                    {searchTerm ? `Hasil pencarian "${searchTerm}"` : 
                     selectedCategory === 'all' ? 'Semua Game' : 
                     categories?.find(cat => cat?.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-text-secondary">
                    {isLoading ? 'Memuat...' : `${filteredGames?.length} game ditemukan`}
                  </p>
                </div>

                {/* View Toggle */}
                <div className="hidden md:flex items-center gap-2 bg-surface/50 rounded-lg p-1 border border-border/50">
                  <button className="p-2 rounded-md bg-primary/10 text-primary">
                    <Icon name="Grid3X3" size={18} />
                  </button>
                  <button className="p-2 rounded-md text-text-secondary hover:text-primary transition-colors">
                    <Icon name="List" size={18} />
                  </button>
                </div>
              </div>

              {/* Games Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)]?.map((_, index) => (
                    <div key={index} className="gaming-card animate-pulse">
                      <div className="w-full h-48 bg-surface/50 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-surface/50 rounded w-3/4"></div>
                        <div className="h-3 bg-surface/50 rounded w-1/2"></div>
                        <div className="h-8 bg-surface/50 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredGames?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredGames?.map((game) => (
                    <GameCard 
                      key={game?.id} 
                      game={game} 
                      onQuickTopUp={handleQuickTopUp}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="Search" size={32} className="text-text-secondary" />
                  </div>
                  <h3 className="text-xl font-gaming font-bold text-foreground mb-2">
                    Tidak ada game ditemukan
                  </h3>
                  <p className="text-text-secondary mb-6">
                    Coba ubah filter atau kata kunci pencarian kamu
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-gradient-to-r from-primary to-secondary text-black px-6 py-3 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </section>

            {/* Load More */}
            {filteredGames?.length > 0 && !isLoading && (
              <div className="text-center mt-12">
                <button className="bg-surface/50 hover:bg-surface/70 text-foreground px-8 py-4 rounded-lg font-gaming font-semibold border border-border/50 hover:border-primary/30 transition-all duration-200 flex items-center gap-2 mx-auto">
                  <Icon name="RotateCcw" size={18} />
                  Muat Lebih Banyak Game
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" size={20} className="text-black" />
                </div>
                <span className="text-xl logo-text">WMX TOPUP</span>
              </div>
              <p className="text-text-secondary mb-6">
                Platform top up gaming terpercaya dengan proses instan dan harga terbaik
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-text-secondary">
                <span>© {new Date()?.getFullYear()} WMX TOPUP</span>
                <span>•</span>
                <span>Semua hak dilindungi</span>
                <span>•</span>
                <span>Dibuat dengan ❤️ untuk gamers Indonesia</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default GameSelectionHub;