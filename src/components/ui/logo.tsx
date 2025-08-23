'use client'

import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'gradient' | 'white'
}

export function Logo({ 
  className, 
  size = 'md', 
  variant = 'default' 
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }

  const variantClasses = {
    default: 'text-white',
    gradient: 'gradient-text',
    white: 'text-white'
  }

  return (
    <div className={cn(
      "font-heading font-black tracking-tight",
      sizeClasses[size],
      variantClasses[variant],
      className
    )}>
      <span className="text-neon-blue">WMX</span>
      <span className="ml-1">TOPUP</span>
    </div>
  )
}
