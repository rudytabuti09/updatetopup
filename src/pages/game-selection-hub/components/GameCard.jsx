import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const GameCard = ({ game, onQuickTopUp }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(<Icon key={i} name="Star" size={14} className="text-gaming-gold fill-current" />);
    }

    if (hasHalfStar) {
      stars?.push(<Icon key="half" name="StarHalf" size={14} className="text-gaming-gold fill-current" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(<Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-600" />);
    }

    return stars;
  };

  return (
    <div 
      className={`gaming-card group cursor-pointer transition-all duration-300 ${
        isHovered ? 'neon-glow transform scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Game Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Image 
          src={game?.image} 
          alt={game?.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {game?.isPopular && (
            <span className="bg-gradient-to-r from-primary to-secondary text-black text-xs font-bold px-2 py-1 rounded-full">
              🔥 POPULER
            </span>
          )}
          {game?.hasPromo && (
            <span className="bg-gradient-to-r from-gaming-gold to-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
              💎 PROMO
            </span>
          )}
        </div>

        {/* Processing Speed */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${
              game?.processingSpeed === 'instant' ? 'bg-green-500' :
              game?.processingSpeed === 'fast' ? 'bg-yellow-500' : 'bg-orange-500'
            }`} />
            <span className="text-xs text-white font-medium">
              {game?.processingSpeed === 'instant' ? 'Instan' :
               game?.processingSpeed === 'fast' ? 'Cepat' : 'Normal'}
            </span>
          </div>
        </div>

        {/* Quick Action Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
            onClick={(e) => {
              e?.preventDefault();
              onQuickTopUp(game);
            }}
          >
            <Icon name="Zap" size={16} className="mr-1" />
            Top Up
          </Button>
        </div>
      </div>
      {/* Game Info */}
      <div className="p-4">
        {/* Game Name & Category */}
        <div className="mb-3">
          <h3 className="text-lg font-gaming font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {game?.name}
          </h3>
          <p className="text-sm text-text-secondary">{game?.category}</p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {getRatingStars(game?.rating)}
          </div>
          <span className="text-sm font-medium text-foreground">{game?.rating}</span>
          <span className="text-xs text-text-secondary">({game?.reviewCount} ulasan)</span>
        </div>

        {/* Package Preview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-secondary">Paket Populer:</span>
            <span className="text-xs text-primary">{game?.packages?.length} paket tersedia</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {game?.packages?.slice(0, 2)?.map((pkg, index) => (
              <div key={index} className="bg-surface/50 rounded-lg p-2 border border-border/50">
                <div className="text-sm font-medium text-foreground">{pkg?.amount}</div>
                <div className="text-xs text-primary font-bold">{formatPrice(pkg?.price)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to="/streamlined-checkout-flow" className="flex-1">
            <Button variant="default" fullWidth className="bg-gradient-to-r from-primary to-secondary">
              <Icon name="ShoppingCart" size={16} className="mr-2" />
              Pilih Paket
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10">
            <Icon name="Heart" size={16} />
          </Button>
        </div>

        {/* User Review Snippet */}
        {game?.topReview && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-start gap-2">
              <Image 
                src={game?.topReview?.avatar} 
                alt={game?.topReview?.username}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-foreground">{game?.topReview?.username}</span>
                  <div className="flex">
                    {getRatingStars(game?.topReview?.rating)}
                  </div>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">{game?.topReview?.comment}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;