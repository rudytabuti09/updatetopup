import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const GameForums = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Semua Game', icon: 'Gamepad2', count: 1247 },
    { id: 'mobile-legends', name: 'Mobile Legends', icon: 'Sword', count: 456 },
    { id: 'pubg-mobile', name: 'PUBG Mobile', icon: 'Target', count: 342 },
    { id: 'free-fire', name: 'Free Fire', icon: 'Zap', count: 289 },
    { id: 'genshin-impact', name: 'Genshin Impact', icon: 'Sparkles', count: 178 },
    { id: 'valorant', name: 'Valorant', icon: 'Crosshair', count: 134 }
  ];

  const forumPosts = [
    {
      id: 1,
      title: "Cara Mendapatkan Skin Epic Mobile Legends Gratis",
      author: "MLProGamer",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face",
      category: "mobile-legends",
      categoryName: "Mobile Legends",
      replies: 89,
      views: 2341,
      lastReply: "15 menit lalu",
      isPinned: true,
      tags: ["Tips", "Skin", "Gratis"]
    },
    {
      id: 2,
      title: "Review Battle Pass PUBG Mobile Season 32",
      author: "PUBGReviewer",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
      category: "pubg-mobile",
      categoryName: "PUBG Mobile",
      replies: 67,
      views: 1876,
      lastReply: "1 jam lalu",
      isPinned: false,
      tags: ["Review", "Battle Pass", "UC"]
    },
    {
      id: 3,
      title: "Event Ramadan Free Fire: Hadiah Terbaik",
      author: "FFEventHunter",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      category: "free-fire",
      categoryName: "Free Fire",
      replies: 124,
      views: 3456,
      lastReply: "2 jam lalu",
      isPinned: true,
      tags: ["Event", "Hadiah", "Diamond"]
    },
    {
      id: 4,
      title: "Genshin Impact: Build Terbaik untuk Zhongli",
      author: "GenshinMaster",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      category: "genshin-impact",
      categoryName: "Genshin Impact",
      replies: 45,
      views: 987,
      lastReply: "3 jam lalu",
      isPinned: false,
      tags: ["Build", "Character", "Guide"]
    },
    {
      id: 5,
      title: "Valorant: Tips Aim Training untuk Pemula",
      author: "ValorantCoach",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      category: "valorant",
      categoryName: "Valorant",
      replies: 78,
      views: 1654,
      lastReply: "4 jam lalu",
      isPinned: false,
      tags: ["Tips", "Aim", "Training"]
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? forumPosts 
    : forumPosts?.filter(post => post?.category === activeCategory);

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-gaming font-bold text-gaming-gradient">
          Forum Game
        </h2>
        <button className="btn-gaming-secondary px-4 py-2 text-sm">
          <Icon name="Plus" size={16} className="mr-2" />
          Buat Post Baru
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
            <span className={`px-2 py-1 rounded-full text-xs ${
              activeCategory === category?.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts?.map((post) => (
          <div key={post?.id} className="border border-border rounded-lg p-4 hover:border-primary/30 transition-all duration-200 cursor-pointer group">
            <div className="flex items-start space-x-4">
              <Image 
                src={post?.avatar} 
                alt={post?.author}
                className="w-12 h-12 rounded-full object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {post?.isPinned && (
                    <Icon name="Pin" size={16} className="text-gaming-gold" />
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                    {post?.categoryName}
                  </span>
                  <div className="flex items-center space-x-1">
                    {post?.tags?.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  {post?.title}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">
                      {post?.author}
                    </span>
                    <span>Balasan terakhir: {post?.lastReply}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Icon name="MessageSquare" size={16} />
                      <span>{post?.replies}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Eye" size={16} />
                      <span>{post?.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Load More */}
      <div className="text-center mt-6">
        <button className="btn-gaming-secondary px-6 py-3">
          <Icon name="ChevronDown" size={16} className="mr-2" />
          Muat Lebih Banyak
        </button>
      </div>
    </div>
  );
};

export default GameForums;