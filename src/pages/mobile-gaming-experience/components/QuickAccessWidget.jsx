import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickAccessWidget = () => {
  const [selectedGame, setSelectedGame] = useState(null);

  const quickAccessGames = [
    {
      id: 1,
      name: "Mobile Legends",
      icon: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&crop=center",
      lastPurchase: "Diamond 275",
      price: "Rp 75.000",
      category: "MOBA",
      isPopular: true
    },
    {
      id: 2,
      name: "Free Fire",
      icon: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&crop=center",
      lastPurchase: "Diamond 720",
      price: "Rp 95.000",
      category: "Battle Royale",
      isPopular: true
    },
    {
      id: 3,
      name: "PUBG Mobile",
      icon: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop&crop=center",
      lastPurchase: "UC 325",
      price: "Rp 50.000",
      category: "Battle Royale",
      isPopular: false
    },
    {
      id: 4,
      name: "Genshin Impact",
      icon: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center",
      lastPurchase: "Genesis Crystal 300",
      price: "Rp 79.000",
      category: "RPG",
      isPopular: true
    }
  ];

  const handleQuickTopUp = (game) => {
    setSelectedGame(game);
    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  return (
    <div className="bg-card rounded-2xl p-4 shadow-gaming border border-border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-gaming font-bold text-foreground">
            Quick Top-Up
          </h3>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          <Icon name="Settings" size={16} className="mr-1" />
          Edit
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {quickAccessGames?.map((game) => (
          <div
            key={game?.id}
            className={`relative bg-surface rounded-xl p-3 border transition-all duration-200 cursor-pointer ${
              selectedGame?.id === game?.id
                ? 'border-primary shadow-neon-blue scale-105'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => handleQuickTopUp(game)}
          >
            {game?.isPopular && (
              <div className="absolute -top-2 -right-2 bg-gaming-gold text-black text-xs px-2 py-1 rounded-full font-bold">
                HOT
              </div>
            )}

            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <Image
                  src={game?.icon}
                  alt={game?.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Play" size={10} className="text-black" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">
                  {game?.name}
                </h4>
                <p className="text-xs text-text-secondary">
                  {game?.category}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary">Last:</span>
                <span className="text-xs text-foreground font-medium">
                  {game?.lastPurchase}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">
                  {game?.price}
                </span>
                <Button 
                  size="xs" 
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
                >
                  <Icon name="Zap" size={12} className="mr-1" />
                  Top Up
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          fullWidth 
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add More Games
        </Button>
      </div>
    </div>
  );
};

export default QuickAccessWidget;