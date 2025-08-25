'use client'

import * as React from "react"
import Image from "next/image"
import { LucideIcon, Award, Flame, Target, Gamepad2, Star, Heart, DollarSign, Handshake, Smartphone, Building2, Store, ShoppingCart, Package } from "lucide-react"
import { cn } from "@/lib/utils"

// Mapping emoji to Lucide icons
const emojiToIconMap: Record<string, LucideIcon> = {
  '🏆': Award,
  '🔥': Flame, 
  '🎯': Target,
  '🎮': Gamepad2,
  '⭐': Star,
  '💙': Heart,
  '💜': Heart,
  '💚': Heart,
  '🤝': Handshake,
  '📱': Smartphone,
  '🏦': Building2,
  '🏪': Store,
  '🛒': ShoppingCart,
  '💎': Package
}

interface LogoImageProps {
  src: string
  alt: string
  fallbackIcon?: LucideIcon
  fallbackEmoji?: string
  fallbackColor?: string
  width?: number
  height?: number
  className?: string
}

export function LogoImage({ 
  src, 
  alt, 
  fallbackIcon: FallbackIcon,
  fallbackEmoji,
  fallbackColor = "text-wmx-gray-400",
  width = 64,
  height = 64,
  className 
}: LogoImageProps) {
  const [hasError, setHasError] = React.useState(false)
  const [isLoaded, setIsLoaded] = React.useState(false)

  // Determine which fallback icon to use
  const ActualFallbackIcon = FallbackIcon || (fallbackEmoji ? emojiToIconMap[fallbackEmoji] : undefined) || Package

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width, height }}>
      {!hasError ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            "object-contain transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true)
            setIsLoaded(false)
          }}
        />
      ) : (
        <ActualFallbackIcon 
          className={cn(fallbackColor, "transition-opacity duration-300 opacity-100")} 
          style={{ width: width * 0.6, height: height * 0.6 }}
        />
      )}
      
      {/* Loading state */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="animate-pulse bg-gradient-to-r from-neon-magenta/20 to-neon-cyan/20 rounded-lg"
            style={{ width: width * 0.8, height: height * 0.8 }}
          />
        </div>
      )}
    </div>
  )
}
