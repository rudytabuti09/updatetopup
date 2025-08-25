'use client'

import * as React from "react"
import { Star, TrendingUp, ShoppingCart, Package } from "lucide-react"
import { GlassCard } from "./glass-card"
import { GradientButton } from "./gradient-button"
import { StatusBadge } from "./status-badge"
import { cn } from "@/lib/utils"
import { usePrefersReducedMotion } from "@/lib/performance"

interface ProductCardProps {
  id: string
  name: string
  description?: string
  price: number
  originalPrice?: number
  rating?: number
  isPopular?: boolean
  discount?: number
  provider: string
  category: string
  image?: string
  gradient?: string
  isActive?: boolean
  onClick?: (productId: string) => void
  className?: string
}

const ProductCardComponent = React.memo<ProductCardProps>(function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  rating = 4.8,
  isPopular = false,
  discount,
  provider,
  category,
  image,
  gradient = "from-blue-600 to-purple-600",
  isActive = true,
  onClick,
  className
}) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const discountPercentage = originalPrice && price < originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discount

  const handleClick = React.useCallback(() => {
    if (isActive && onClick) {
      onClick(id)
    }
  }, [isActive, onClick, id])

  return (
    <GlassCard 
      hover={isActive} 
      className={cn(
        "p-0 overflow-hidden group gpu-accelerated",
        prefersReducedMotion ? "transition-none" : "transition-all duration-300",
        !isActive && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={handleClick}
    >
      {/* Product Header */}
      <div className={cn(
        "relative p-4 bg-gradient-to-r text-center",
        gradient
      )}>
        <div className="mb-2 flex justify-center">
          {image ? (
            <div className="text-3xl">{image}</div>
          ) : (
            <Package className="h-8 w-8 text-white" />
          )}
        </div>
        <h3 className="font-bold text-white text-sm line-clamp-2">{name}</h3>
        {description && (
          <p className="text-white/80 text-xs mt-1 line-clamp-1">{description}</p>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isPopular && (
            <div className="bg-gradient-primary text-white text-xs px-2 py-1 rounded-full flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Popular
            </div>
          )}
          {discountPercentage && discountPercentage > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
              -{discountPercentage}%
            </div>
          )}
          {!isActive && (
            <StatusBadge status="failed" />
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 space-y-3">
        {/* Rating & Provider */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center text-yellow-400">
            <Star className="h-3 w-3 fill-current mr-1" />
            <span>{rating}</span>
          </div>
          <span className="text-white/60">{provider}</span>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-neon-blue text-lg">
              Rp {price.toLocaleString('id-ID')}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-xs text-white/60 line-through">
                Rp {originalPrice.toLocaleString('id-ID')}
              </div>
            )}
          </div>
          
          {/* Savings */}
          {originalPrice && originalPrice > price && (
            <div className="text-xs text-green-400">
              Hemat Rp {(originalPrice - price).toLocaleString('id-ID')}
            </div>
          )}
        </div>

        {/* Action Button */}
        <GradientButton
          variant="primary"
          size="sm"
          className="w-full"
          disabled={!isActive}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {isActive ? "Beli Sekarang" : "Tidak Tersedia"}
        </GradientButton>
      </div>
    </GlassCard>
  )
})

// Export with display name for better debugging
ProductCardComponent.displayName = 'ProductCard'

export { ProductCardComponent as ProductCard }
