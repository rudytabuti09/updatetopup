import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingDiscussions = () => {
  const discussions = [
    {
      id: 1,
      title: "Tips Hemat Top-up Mobile Legends: Bang Bang",
      author: "GamerPro_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      category: "Mobile Legends",
      replies: 247,
      likes: 892,
      timeAgo: "2 jam lalu",
      isHot: true,
      excerpt: "Strategi terbaik untuk mendapatkan diamond dengan harga terjangkau dan promo eksklusif WMX TOPUP..."
    },
    {
      id: 2,
      title: "Update Terbaru PUBG Mobile: Season 32 Battle Pass",
      author: "PUBGMaster88",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      category: "PUBG Mobile",
      replies: 156,
      likes: 634,
      timeAgo: "4 jam lalu",
      isHot: true,
      excerpt: "Review lengkap Battle Pass season baru dan cara optimal menggunakan UC untuk maksimal rewards..."
    },
    {
      id: 3,
      title: "Free Fire: Strategi Bermain di Ranked Match",
      author: "FFChampion",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      category: "Free Fire",
      replies: 89,
      likes: 423,
      timeAgo: "6 jam lalu",
      isHot: false,
      excerpt: "Panduan lengkap untuk naik rank dengan efisien dan tips penggunaan diamond untuk karakter..."
    },
    {
      id: 4,
      title: "Genshin Impact: Event Terbaru dan Primogem Guide",
      author: "TravelerIndo",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      category: "Genshin Impact",
      replies: 203,
      likes: 756,
      timeAgo: "8 jam lalu",
      isHot: true,
      excerpt: "Event limited time dan cara mengoptimalkan primogem untuk gacha karakter favorit..."
    }
  ];

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Diskusi Trending
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          Lihat Semua
        </button>
      </div>
      <div className="space-y-4">
        {discussions?.map((discussion) => (
          <div key={discussion?.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start space-x-4">
              <Image 
                src={discussion?.avatar} 
                alt={discussion?.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {discussion?.isHot && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                      <Icon name="Flame" size={12} className="mr-1" />
                      Hot
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {discussion?.category}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {discussion?.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {discussion?.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">
                      {discussion?.author}
                    </span>
                    <span>{discussion?.timeAgo}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={16} />
                      <span>{discussion?.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Heart" size={16} />
                      <span>{discussion?.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingDiscussions;