import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import useSupabaseData from '../../hooks/useSupabaseData';
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
  const { user } = useAuth();
  const {
    categories,
    trendingGames,
    recommendedGames,
    allGames: filteredGames,
    promoOffers,
    searchSuggestions,
    userPreferences,
    isLoading,
    filters,
    selectedCategory,
    searchTerm,
    handleCategoryChange,
    handleSearch,
    handleFiltersChange,
    handleClearFilters
  } = useSupabaseData();

  // All data now comes from useSupabaseData hook - no more mock data!

  const handleQuickTopUp = (game) => {
    console.log('Quick top up for:', game?.name);
    // Navigate to checkout with pre-selected game
    // You can add navigation logic here
  };

  const handleLocalClearFilters = () => {
    handleClearFilters();
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
                onSearch={handleSearch}
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
              onCategoryChange={handleCategoryChange}
            />

            {/* Filter Panel */}
            <FilterPanel 
              filters={filters}
              onFiltersChange={handleFiltersChange}
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