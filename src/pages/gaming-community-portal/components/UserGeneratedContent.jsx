import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const UserGeneratedContent = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  const tabs = [
    { id: 'reviews', name: 'Review Game', icon: 'Star' },
    { id: 'guides', name: 'Panduan', icon: 'BookOpen' },
    { id: 'tips', name: 'Tips & Trik', icon: 'Lightbulb' }
  ];

  const gameReviews = [
    {
      id: 1,
      title: "Review Lengkap: Mobile Legends Season 32 - Worth It atau Tidak?",
      author: "ReviewerPro_ID",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      game: "Mobile Legends",
      rating: 4.5,
      likes: 234,
      comments: 67,
      publishedAt: "3 jam lalu",
      excerpt: "Season 32 Mobile Legends membawa banyak perubahan signifikan. Dari hero baru Arlott hingga revamp map yang memukau...",
      tags: ["Review", "Season 32", "Hero Baru"],
      readTime: "8 menit"
    },
    {
      id: 2,
      title: "PUBG Mobile vs Free Fire: Perbandingan Battle Royale Terbaik 2025",
      author: "BattleRoyaleExpert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      game: "Multi Game",
      rating: 4.2,
      likes: 189,
      comments: 45,
      publishedAt: "6 jam lalu",
      excerpt: "Analisis mendalam tentang kedua game battle royale paling populer di Indonesia. Mana yang lebih worth it untuk dimainkan?",
      tags: ["Comparison", "Battle Royale", "Analysis"],
      readTime: "12 menit"
    },
    {
      id: 3,
      title: "Genshin Impact: Apakah Zhongli Masih Meta di Update Terbaru?",
      author: "GenshinAnalyst",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      game: "Genshin Impact",
      rating: 4.8,
      likes: 156,
      comments: 32,
      publishedAt: "1 hari lalu",
      excerpt: "Review mendalam tentang performa Zhongli di meta saat ini dan apakah masih worth it untuk di-pull...",
      tags: ["Character Review", "Meta", "Analysis"],
      readTime: "6 menit"
    }
  ];

  const guides = [
    {
      id: 1,
      title: "Panduan Lengkap: Cara Efisien Menggunakan Diamond Mobile Legends",
      author: "DiamondGuide_ID",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      game: "Mobile Legends",
      views: 3420,
      bookmarks: 234,
      publishedAt: "2 hari lalu",
      excerpt: "Strategi terbaik untuk memaksimalkan penggunaan diamond, dari skin hingga battle pass. Hemat tapi tetap optimal!",
      tags: ["Diamond Guide", "F2P Friendly", "Strategy"],
      difficulty: "Pemula"
    },
    {
      id: 2,
      title: "PUBG Mobile: Panduan Lengkap Weapon Attachment untuk Setiap Senjata",
      author: "PUBGTactical",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
      game: "PUBG Mobile",
      views: 2890,
      bookmarks: 187,
      publishedAt: "3 hari lalu",
      excerpt: "Guide komprehensif tentang attachment terbaik untuk setiap jenis senjata di PUBG Mobile. Dari AR hingga Sniper!",
      tags: ["Weapon Guide", "Attachment", "Tactical"],
      difficulty: "Menengah"
    },
    {
      id: 3,
      title: "Free Fire: Panduan Character Combination untuk Squad Ranked",
      author: "FFStrategist",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      game: "Free Fire",
      views: 2156,
      bookmarks: 145,
      publishedAt: "4 hari lalu",
      excerpt: "Kombinasi karakter terbaik untuk bermain squad di ranked match. Strategi yang terbukti efektif untuk naik rank!",
      tags: ["Character Guide", "Squad", "Ranked"],
      difficulty: "Lanjutan"
    }
  ];

  const tips = [
    {
      id: 1,
      title: "5 Tips Hemat Top-up Game Favorit Tanpa Mengurangi Performa",
      author: "BudgetGamer_ID",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      category: "Budget Tips",
      likes: 567,
      shares: 89,
      publishedAt: "1 jam lalu",
      excerpt: "Cara cerdas mengatur budget gaming dan mendapatkan value terbaik dari setiap rupiah yang dikeluarkan...",
      tags: ["Budget", "Smart Spending", "Tips"],
      estimatedSavings: "30-50%"
    },
    {
      id: 2,
      title: "Trik Jitu Mendapatkan Skin Rare dengan Budget Minimal",
      author: "SkinHunter88",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
      category: "Skin Tips",
      likes: 423,
      shares: 67,
      publishedAt: "5 jam lalu",
      excerpt: "Strategi proven untuk mendapatkan skin langka tanpa menghabiskan banyak uang. Event timing adalah kuncinya!",
      tags: ["Skin", "Event", "Strategy"],
      estimatedSavings: "40-60%"
    },
    {
      id: 3,
      title: "Cara Maksimalkan Battle Pass Rewards dengan Strategi Tepat",
      author: "BattlePassPro",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
      category: "Battle Pass",
      likes: 345,
      shares: 54,
      publishedAt: "8 jam lalu",
      excerpt: "Tips dan trik untuk menyelesaikan battle pass dengan efisien dan mendapatkan semua reward premium...",
      tags: ["Battle Pass", "Efficiency", "Rewards"],
      estimatedSavings: "25-35%"
    }
  ];

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'reviews':
        return gameReviews;
      case 'guides':
        return guides;
      case 'tips':
        return tips;
      default:
        return gameReviews;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-gaming-gold fill-current" />);
    }

    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="Star" size={14} className="text-gaming-gold fill-current opacity-50" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />);
    }

    return stars;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Pemula':
        return 'bg-success/20 text-success';
      case 'Menengah':
        return 'bg-warning/20 text-warning';
      case 'Lanjutan':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Konten Komunitas
        </h2>
        <button className="btn-gaming-secondary px-4 py-2 text-sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Buat Konten
        </button>
      </div>
      {/* Content Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.name}</span>
          </button>
        ))}
      </div>
      {/* Content Grid */}
      <div className="space-y-6">
        {getCurrentContent()?.map((content) => (
          <div key={content?.id} className="border border-border rounded-lg p-6 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start space-x-4">
              <Image 
                src={content?.avatar} 
                alt={content?.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {content?.game || content?.category}
                  </span>
                  
                  {content?.difficulty && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(content?.difficulty)}`}>
                      {content?.difficulty}
                    </span>
                  )}
                  
                  {content?.estimatedSavings && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
                      Hemat {content?.estimatedSavings}
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {content?.title}
                </h3>
                
                {content?.rating && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(content?.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {content?.rating}/5.0
                    </span>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {content?.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">
                      {content?.author}
                    </span>
                    <span>{content?.publishedAt}</span>
                    {content?.readTime && <span>{content?.readTime} baca</span>}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {content?.tags?.slice(0, 3)?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {content?.likes && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Heart" size={16} />
                        <span>{content?.likes}</span>
                      </div>
                    )}
                    
                    {content?.comments && (
                      <div className="flex items-center space-x-1">
                        <Icon name="MessageSquare" size={16} />
                        <span>{content?.comments}</span>
                      </div>
                    )}
                    
                    {content?.views && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Eye" size={16} />
                        <span>{content?.views}</span>
                      </div>
                    )}
                    
                    {content?.bookmarks && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Bookmark" size={16} />
                        <span>{content?.bookmarks}</span>
                      </div>
                    )}
                    
                    {content?.shares && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Share2" size={16} />
                        <span>{content?.shares}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center mt-8">
        <button className="btn-gaming-secondary px-6 py-3">
          <Icon name="ChevronDown" size={16} className="mr-2" />
          Muat Konten Lainnya
        </button>
      </div>
    </div>
  );
};

export default UserGeneratedContent;