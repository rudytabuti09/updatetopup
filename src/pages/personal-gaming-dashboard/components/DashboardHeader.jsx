import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const DashboardHeader = ({ user, stats }) => {
  const getGreeting = () => {
    const hour = new Date()?.getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
  };

  return (
    <div className="bg-gradient-to-r from-card to-surface rounded-xl p-6 mb-8 border border-border shadow-gaming">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={user?.avatar}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-primary shadow-neon-blue"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
              <Icon name="Zap" size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-gaming font-bold text-gaming-gradient">
              {getGreeting()}, {user?.name}!
            </h1>
            <p className="text-text-secondary">
              Level {user?.level} • {user?.tier} Member
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{stats?.totalTopups}</div>
            <div className="text-sm text-text-secondary">Total Top-ups</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{stats?.favoriteGames}</div>
            <div className="text-sm text-text-secondary">Favorite Games</div>
          </div>
          <div className="w-px h-12 bg-border"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gaming-gold">Rp {stats?.totalSpent?.toLocaleString('id-ID')}</div>
            <div className="text-sm text-text-secondary">Total Spent</div>
          </div>
        </div>
      </div>
      {/* Mobile Stats */}
      <div className="md:hidden grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-lg font-bold text-primary">{stats?.totalTopups}</div>
          <div className="text-xs text-text-secondary">Top-ups</div>
        </div>
        <div className="text-center p-3 bg-secondary/10 rounded-lg">
          <div className="text-lg font-bold text-secondary">{stats?.favoriteGames}</div>
          <div className="text-xs text-text-secondary">Games</div>
        </div>
        <div className="text-center p-3 bg-gaming-gold/10 rounded-lg">
          <div className="text-lg font-bold text-gaming-gold">Rp {(stats?.totalSpent / 1000)?.toFixed(0)}K</div>
          <div className="text-xs text-text-secondary">Spent</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;