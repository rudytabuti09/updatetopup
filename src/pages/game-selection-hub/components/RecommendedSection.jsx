import React from 'react';
import Icon from '../../../components/AppIcon';
import GameCard from './GameCard';

const RecommendedSection = ({ recommendedGames, onQuickTopUp, userPreferences }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary to-purple-600 rounded-lg flex items-center justify-center">
            <Icon name="Sparkles" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">Rekomendasi Untuk Kamu</h2>
            <p className="text-sm text-text-secondary">Berdasarkan preferensi dan riwayat gaming kamu</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <div className="bg-surface/50 rounded-lg px-3 py-1 border border-border/50">
            <span className="text-xs text-text-secondary">Akurasi: </span>
            <span className="text-xs text-primary font-bold">94%</span>
          </div>
        </div>
      </div>
      {/* User Preferences Insight */}
      {userPreferences && (
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg p-6 mb-8 border border-secondary/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Brain" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-gaming font-bold text-foreground mb-2">Profil Gaming Kamu</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-text-secondary">Genre Favorit:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {userPreferences?.favoriteGenres?.map((genre, index) => (
                      <span key={index} className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Rata-rata Top Up:</span>
                  <div className="text-sm font-bold text-primary mt-1">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    })?.format(userPreferences?.averageSpending)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Waktu Bermain:</span>
                  <div className="text-sm font-bold text-gaming-gold mt-1">{userPreferences?.playTime}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Recommendation Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Sesuai Preferensi</span>
          </div>
          <p className="text-xs text-text-secondary">Game yang cocok dengan genre dan gaya bermain kamu</p>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Sedang Populer</span>
          </div>
          <p className="text-xs text-text-secondary">Game yang sedang trending di komunitas gaming</p>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="DollarSign" size={16} className="text-gaming-gold" />
            <span className="text-sm font-medium text-foreground">Value Terbaik</span>
          </div>
          <p className="text-xs text-text-secondary">Paket dengan nilai terbaik sesuai budget kamu</p>
        </div>
      </div>
      {/* Recommended Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedGames?.map((game) => (
          <div key={game?.id} className="relative">
            {/* Recommendation Badge */}
            <div className="absolute -top-2 -right-2 z-10">
              <div className="bg-gradient-to-r from-secondary to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <Icon name="Sparkles" size={12} />
                {game?.matchPercentage}%
              </div>
            </div>
            
            <GameCard game={game} onQuickTopUp={onQuickTopUp} />
            
            {/* Recommendation Reason */}
            {game?.recommendationReason && (
              <div className="mt-3 bg-secondary/10 rounded-lg p-3 border border-secondary/20">
                <div className="flex items-start gap-2">
                  <Icon name="Lightbulb" size={14} className="text-secondary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground">{game?.recommendationReason}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Load More Recommendations */}
      <div className="text-center mt-8">
        <button className="bg-gradient-to-r from-secondary to-purple-600 text-white px-8 py-3 rounded-lg font-gaming font-semibold hover:shadow-neon-purple transition-all duration-200 flex items-center gap-2 mx-auto">
          <Icon name="RefreshCw" size={18} />
          Muat Rekomendasi Lainnya
        </button>
      </div>
    </div>
  );
};

export default RecommendedSection;