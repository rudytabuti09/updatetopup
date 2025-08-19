import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import useSupabaseData from '../hooks/useSupabaseData'
import Icon from './AppIcon'

// Contoh komponen yang menggunakan data dari Supabase
const SupabaseGameCard = ({ game }) => {
  const { isAuthenticated } = useAuth()
  const { addToFavorites, removeFromFavorites, isGameFavorited } = useSupabaseData()
  const [isFavorited, setIsFavorited] = useState(isGameFavorited(game.id))
  const [isLoading, setIsLoading] = useState(false)

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to add favorites')
      return
    }

    setIsLoading(true)
    try {
      if (isFavorited) {
        const { error } = await removeFromFavorites(game.id)
        if (!error) {
          setIsFavorited(false)
        }
      } else {
        const { error } = await addToFavorites(game.id)
        if (!error) {
          setIsFavorited(true)
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getProcessingSpeedColor = (speed) => {
    switch (speed) {
      case 'instant': return 'text-green-500'
      case 'fast': return 'text-blue-500'
      case 'normal': return 'text-yellow-500'
      default: return 'text-gray-500'
    }
  }

  const getProcessingSpeedText = (speed) => {
    switch (speed) {
      case 'instant': return 'Instan'
      case 'fast': return 'Cepat'
      case 'normal': return 'Normal'
      default: return 'Unknown'
    }
  }

  return (
    <div className="gaming-card group hover:scale-105 transition-all duration-300">
      {/* Game Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={game.image} 
          alt={game.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Overlay with favorite button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-3 right-3">
            <button
              onClick={handleFavoriteToggle}
              disabled={isLoading || !isAuthenticated}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500/80 text-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon 
                name={isFavorited ? "Heart" : "Heart"} 
                size={16} 
                className={isFavorited ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {game.isPopular && (
            <span className="bg-gradient-to-r from-primary to-secondary text-black text-xs font-gaming font-bold px-2 py-1 rounded-full">
              POPULAR
            </span>
          )}
          {game.hasPromo && (
            <span className="bg-red-500 text-white text-xs font-gaming font-bold px-2 py-1 rounded-full">
              PROMO
            </span>
          )}
        </div>
      </div>

      {/* Game Info */}
      <div className="p-4 space-y-3">
        {/* Game Name & Category */}
        <div>
          <h3 className="font-gaming font-bold text-foreground text-lg mb-1 line-clamp-1">
            {game.name}
          </h3>
          <p className="text-text-secondary text-sm uppercase tracking-wide">
            {game.category}
          </p>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={14} className="text-gaming-gold fill-current" />
            <span className="text-sm font-semibold text-foreground">
              {game.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-text-secondary text-sm">
            ({game.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Processing Speed */}
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={14} className={getProcessingSpeedColor(game.processingSpeed)} />
          <span className={`text-sm font-medium ${getProcessingSpeedColor(game.processingSpeed)}`}>
            {getProcessingSpeedText(game.processingSpeed)}
          </span>
        </div>

        {/* Price Range */}
        {game.packages && game.packages.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-text-secondary">Mulai dari:</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-gaming font-bold text-primary">
                {formatPrice(Math.min(...game.packages.map(pkg => pkg.price)))}
              </span>
              {game.packages.some(pkg => pkg.originalPrice > pkg.price) && (
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(Math.min(...game.packages.map(pkg => pkg.originalPrice || pkg.price)))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Review */}
        {game.topReview && (
          <div className="bg-surface/30 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <img 
                src={game.topReview.avatar} 
                alt={game.topReview.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm font-medium text-foreground">
                {game.topReview.username}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Icon 
                    key={i}
                    name="Star" 
                    size={12} 
                    className={`${
                      i < game.topReview.rating 
                        ? 'text-gaming-gold fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2">
              "{game.topReview.comment}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => console.log('View details:', game.name)}
            className="flex-1 bg-surface/50 hover:bg-surface/70 text-foreground py-2 px-4 rounded-lg font-gaming font-semibold transition-all duration-200 border border-border/50 hover:border-primary/30"
          >
            Lihat Detail
          </button>
          <button 
            onClick={() => console.log('Quick top up:', game.name)}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-black py-2 px-4 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200"
          >
            Top Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default SupabaseGameCard