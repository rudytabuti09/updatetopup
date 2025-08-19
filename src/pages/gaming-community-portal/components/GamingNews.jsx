import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GamingNews = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Semua Berita', icon: 'Newspaper' },
    { id: 'updates', name: 'Update Game', icon: 'Download' },
    { id: 'events', name: 'Event & Turnamen', icon: 'Calendar' },
    { id: 'releases', name: 'Rilis Baru', icon: 'Sparkles' }
  ];

  const newsArticles = [
    {
      id: 1,
      title: "Mobile Legends: Bang Bang Season 32 - Hero Baru Arlott Resmi Dirilis",
      excerpt: "Moonton merilis hero assassin terbaru dengan kemampuan unik yang dapat mengubah jalannya pertandingan. Arlott hadir dengan skill set yang revolusioner...",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=250&fit=crop",
      category: "updates",
      categoryName: "Update Game",
      author: "WMX Gaming News",
      publishedAt: "2 jam lalu",
      readTime: "3 menit",
      tags: ["Mobile Legends", "Hero Baru", "Update"],
      isBreaking: true
    },
    {
      id: 2,
      title: "PUBG Mobile: Event Ramadan 2025 Hadirkan Skin Eksklusif dan Hadiah Menarik",
      excerpt: "Tencent Games mengumumkan event spesial Ramadan dengan berbagai hadiah eksklusif termasuk skin senjata limited edition dan outfit tradisional...",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
      category: "events",
      categoryName: "Event & Turnamen",
      author: "PUBG Indonesia",
      publishedAt: "4 jam lalu",
      readTime: "4 menit",
      tags: ["PUBG Mobile", "Event", "Ramadan"],
      isBreaking: false
    },
    {
      id: 3,
      title: "Free Fire: Turnamen Nasional Indonesia 2025 Berhadiah Total 2 Miliar Rupiah",
      excerpt: "Garena mengumumkan turnamen Free Fire terbesar di Indonesia dengan total hadiah mencapai 2 miliar rupiah. Pendaftaran dibuka mulai minggu depan...",
      image: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=250&fit=crop",
      category: "events",
      categoryName: "Event & Turnamen",
      author: "Garena Indonesia",
      publishedAt: "6 jam lalu",
      readTime: "5 menit",
      tags: ["Free Fire", "Turnamen", "Indonesia"],
      isBreaking: true
    },
    {
      id: 4,
      title: "Genshin Impact: Update 4.5 Membawa Region Baru dan Karakter 5-Star Terbaru",
      excerpt: "miHoYo merilis update besar dengan region Fontaine yang diperluas dan memperkenalkan karakter Hydro 5-star yang telah ditunggu-tunggu para traveler...",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      category: "updates",
      categoryName: "Update Game",
      author: "Genshin News ID",
      publishedAt: "8 jam lalu",
      readTime: "6 menit",
      tags: ["Genshin Impact", "Update", "Karakter Baru"],
      isBreaking: false
    },
    {
      id: 5,
      title: "Valorant Mobile: Riot Games Konfirmasi Peluncuran Beta di Asia Tenggara",
      excerpt: "Riot Games akhirnya mengkonfirmasi bahwa Valorant Mobile akan segera memasuki fase beta testing di region Asia Tenggara termasuk Indonesia...",
      image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=250&fit=crop",
      category: "releases",
      categoryName: "Rilis Baru",
      author: "Riot Games SEA",
      publishedAt: "12 jam lalu",
      readTime: "4 menit",
      tags: ["Valorant", "Mobile", "Beta"],
      isBreaking: true
    },
    {
      id: 6,
      title: "Call of Duty Mobile: Season 3 Battle Pass Hadirkan Tema Cyberpunk",
      excerpt: "Activision merilis Battle Pass Season 3 dengan tema cyberpunk futuristik, lengkap dengan senjata dan skin karakter bergaya neon...",
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=250&fit=crop",
      category: "updates",
      categoryName: "Update Game",
      author: "COD Mobile ID",
      publishedAt: "1 hari lalu",
      readTime: "3 menit",
      tags: ["Call of Duty", "Battle Pass", "Cyberpunk"],
      isBreaking: false
    }
  ];

  const filteredNews = activeCategory === 'all' 
    ? newsArticles 
    : newsArticles?.filter(article => article?.category === activeCategory);

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Berita Gaming
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          Lihat Semua Berita
        </button>
      </div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border pb-4">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === category?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Featured News */}
      {filteredNews?.length > 0 && (
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-lg border border-border group cursor-pointer">
            <Image 
              src={filteredNews?.[0]?.image} 
              alt={filteredNews?.[0]?.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center space-x-2 mb-3">
                {filteredNews?.[0]?.isBreaking && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                    <Icon name="Zap" size={12} className="mr-1" />
                    Breaking
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary backdrop-blur-sm">
                  {filteredNews?.[0]?.categoryName}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {filteredNews?.[0]?.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {filteredNews?.[0]?.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>{filteredNews?.[0]?.author}</span>
                  <span>{filteredNews?.[0]?.publishedAt}</span>
                  <span>{filteredNews?.[0]?.readTime} baca</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Eye" size={14} />
                  <span>2.4k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredNews?.slice(1)?.map((article) => (
          <div key={article?.id} className="border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            <div className="relative">
              <Image 
                src={article?.image} 
                alt={article?.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                {article?.isBreaking && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                    <Icon name="Zap" size={10} className="mr-1" />
                    Breaking
                  </span>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {article?.categoryName}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                {article?.title}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {article?.excerpt}
              </p>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <div className="flex items-center space-x-3">
                  <span>{article?.author}</span>
                  <span>{article?.publishedAt}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={12} />
                  <span>{article?.readTime}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {article?.tags?.slice(0, 2)?.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Icon name="Eye" size={12} />
                    <span>1.2k</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name="MessageSquare" size={12} />
                    <span>45</span>
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
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Muat Berita Lainnya
        </button>
      </div>
    </div>
  );
};

export default GamingNews;