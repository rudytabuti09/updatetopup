import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LiveTrendsSection = () => {
  const trendingGames = [
    {
      id: 1,
      name: "Mobile Legends",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center",
      activeUsers: "2.1M",
      topUpsToday: "45.2K",
      trend: "up",
      trendPercent: "+12%",
      category: "MOBA"
    },
    {
      id: 2,
      name: "Free Fire",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
      activeUsers: "1.8M",
      topUpsToday: "38.7K",
      trend: "up",
      trendPercent: "+8%",
      category: "Battle Royale"
    },
    {
      id: 3,
      name: "PUBG Mobile",
      logo: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop&crop=center",
      activeUsers: "1.5M",
      topUpsToday: "32.1K",
      trend: "up",
      trendPercent: "+15%",
      category: "Battle Royale"
    },
    {
      id: 4,
      name: "Genshin Impact",
      logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center",
      activeUsers: "890K",
      topUpsToday: "28.9K",
      trend: "up",
      trendPercent: "+22%",
      category: "RPG"
    },
    {
      id: 5,
      name: "Valorant",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
      activeUsers: "750K",
      topUpsToday: "19.3K",
      trend: "stable",
      trendPercent: "+3%",
      category: "FPS"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary font-accent font-bold uppercase tracking-wider text-sm">
              Live Gaming Trends
            </span>
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gradient mb-6">
            Game Trending Hari Ini
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Lihat game paling populer dengan aktivitas top-up tertinggi di Indonesia
          </p>
        </div>

        {/* Live Stats Bar */}
        <div className="gaming-card p-6 mb-12 border border-primary/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-success text-sm font-medium">Live</span>
              </div>
              <div className="text-2xl font-gaming font-bold text-foreground">163.4K</div>
              <div className="text-text-secondary text-sm">Top-ups Hari Ini</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span className="text-primary text-sm font-medium">Active</span>
              </div>
              <div className="text-2xl font-gaming font-bold text-foreground">7.1M</div>
              <div className="text-text-secondary text-sm">Gamer Online</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="TrendingUp" size={16} className="text-gaming-gold" />
                <span className="text-gaming-gold text-sm font-medium">Growth</span>
              </div>
              <div className="text-2xl font-gaming font-bold text-foreground">+18%</div>
              <div className="text-text-secondary text-sm">vs Kemarin</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon name="Clock" size={16} className="text-secondary" />
                <span className="text-secondary text-sm font-medium">Avg Time</span>
              </div>
              <div className="text-2xl font-gaming font-bold text-foreground">28s</div>
              <div className="text-text-secondary text-sm">Waktu Transaksi</div>
            </div>
          </div>
        </div>

        {/* Trending Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {trendingGames?.map((game, index) => (
            <Link 
              key={game?.id} 
              to="/game-selection-hub"
              className="gaming-card p-6 group hover:border-primary/40 transition-all duration-300"
            >
              {/* Rank Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-gaming-gold text-black' :
                  index === 1 ? 'bg-gray-400 text-black' :
                  index === 2 ? 'bg-amber-600 text-white': 'bg-primary/20 text-primary'
                }`}>
                  {index + 1}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  game?.trend === 'up' ? 'bg-success/20 text-success' : 'bg-muted text-text-secondary'
                }`}>
                  <Icon name={game?.trend === 'up' ? 'TrendingUp' : 'Minus'} size={12} />
                  {game?.trendPercent}
                </div>
              </div>

              {/* Game Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                  <Image 
                    src={game?.logo} 
                    alt={game?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Game Info */}
              <div className="text-center">
                <h3 className="font-gaming font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {game?.name}
                </h3>
                <div className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full inline-block mb-3">
                  {game?.category}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Active Users:</span>
                    <span className="text-foreground font-medium">{game?.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Top-ups:</span>
                    <span className="text-primary font-medium">{game?.topUpsToday}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-center gap-2 text-primary text-sm font-medium">
                  <span>Top Up Sekarang</span>
                  <Icon name="ArrowRight" size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/game-selection-hub">
            <button className="btn-gaming-secondary">
              <Icon name="Grid3X3" size={20} className="mr-2" />
              Lihat Semua Game
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveTrendsSection;