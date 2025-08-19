import React from 'react';
import Icon from '../../../components/AppIcon';
import GameCard from './GameCard';

const TrendingSection = ({ trendingGames, onQuickTopUp }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gaming-gold to-yellow-500 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">Game Trending</h2>
            <p className="text-sm text-text-secondary">Game paling populer minggu ini</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-surface/50 rounded-lg px-4 py-2 border border-border/50">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-foreground font-medium">Live Update</span>
        </div>
      </div>
      {/* Trending Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={16} className="text-primary" />
            <span className="text-xs text-text-secondary font-medium">Total Pemain</span>
          </div>
          <div className="text-lg font-bold text-foreground">2.4M+</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <Icon name="ArrowUp" size={12} />
            +12% minggu ini
          </div>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="ShoppingCart" size={16} className="text-secondary" />
            <span className="text-xs text-text-secondary font-medium">Transaksi Hari Ini</span>
          </div>
          <div className="text-lg font-bold text-foreground">15.7K</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <Icon name="ArrowUp" size={12} />
            +8% dari kemarin
          </div>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Zap" size={16} className="text-gaming-gold" />
            <span className="text-xs text-text-secondary font-medium">Proses Tercepat</span>
          </div>
          <div className="text-lg font-bold text-foreground">12 detik</div>
          <div className="text-xs text-primary">Rata-rata</div>
        </div>

        <div className="bg-surface/30 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Star" size={16} className="text-gaming-gold" />
            <span className="text-xs text-text-secondary font-medium">Rating Kepuasan</span>
          </div>
          <div className="text-lg font-bold text-foreground">4.9/5</div>
          <div className="text-xs text-gaming-gold">Excellent</div>
        </div>
      </div>
      {/* Trending Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingGames?.map((game, index) => (
          <div key={game?.id} className="relative">
            {/* Trending Badge */}
            {index < 3 && (
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  index === 0 ? 'bg-gradient-to-r from-gaming-gold to-yellow-500 text-black' :
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-black': 'bg-gradient-to-r from-amber-600 to-amber-700 text-white'
                }`}>
                  #{index + 1}
                </div>
              </div>
            )}
            <GameCard game={game} onQuickTopUp={onQuickTopUp} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingSection;