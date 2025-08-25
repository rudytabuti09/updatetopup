'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface WMXLogoProps {
  className?: string
  width?: number
  height?: number
}

export function WMXLogo({ className, width = 120, height = 120 }: WMXLogoProps) {
  return (
    <div className={cn("relative inline-block", className)} style={{ width, height }}>
      {/* Main Diamond Badge */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-glow-magenta"
      >
        {/* Diamond Badge Background */}
        <path
          d="M100 20 L160 70 L160 130 L100 180 L40 130 L40 70 Z"
          fill="url(#diamondGradient)"
          stroke="url(#borderGradient)"
          strokeWidth="3"
        />
        
        {/* Inner Glow */}
        <path
          d="M100 30 L150 75 L150 125 L100 170 L50 125 L50 75 Z"
          fill="url(#innerGlow)"
          opacity="0.6"
        />
        
        {/* Diamond Icon */}
        <g transform="translate(100, 50)">
          <path
            d="M0 -15 L-12 0 L0 25 L12 0 Z"
            fill="url(#diamondIcon)"
            stroke="#00FFFF"
            strokeWidth="2"
          />
          <path
            d="M-12 0 L12 0"
            stroke="#00FFFF"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <path
            d="M-8 -7.5 L8 -7.5"
            stroke="#00FFFF"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>
        
        {/* WMX Text */}
        <g transform="translate(100, 120)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            className="font-heading font-black text-4xl"
            fill="url(#textGradient)"
            stroke="url(#textStroke)"
            strokeWidth="1"
          >
            WMX
          </text>
        </g>
        
        {/* TOP UP Text */}
        <g transform="translate(100, 145)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            className="font-sans font-bold text-lg tracking-wider"
            fill="url(#subTextGradient)"
          >
            TOP UP
          </text>
        </g>
        
        {/* SERVICES Text */}
        <g transform="translate(100, 165)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            className="font-sans font-medium text-xs tracking-widest uppercase"
            fill="#FFFFFF"
            opacity="0.8"
          >
            SERVICES
          </text>
        </g>
        
        {/* Neon Effects */}
        <g>
          {/* Corner Accents */}
          <circle cx="70" cy="50" r="2" fill="#FFD700" opacity="0.8">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="130" cy="50" r="2" fill="#00FFFF" opacity="0.8">
            <animate attributeName="opacity" values="1;0.8;1" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="100" r="1.5" fill="#FF00FF" opacity="0.6">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />
          </circle>
        </g>
        
        {/* Gradients */}
        <defs>
          <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#6B46C1" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="25%" stopColor="#FF00FF" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="75%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
          
          <radialGradient id="innerGlow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF00FF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00FFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          <linearGradient id="diamondIcon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="33%" stopColor="#FF00FF" />
            <stop offset="66%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
          
          <linearGradient id="textStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
          
          <linearGradient id="subTextGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#00FFFF" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Animated Glow Ring */}
      <div className="absolute inset-0 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
        <div className="absolute top-2 left-1/2 w-1 h-1 bg-neon-magenta rounded-full transform -translate-x-1/2"></div>
        <div className="absolute bottom-2 left-1/2 w-1 h-1 bg-neon-cyan rounded-full transform -translate-x-1/2"></div>
        <div className="absolute left-2 top-1/2 w-1 h-1 bg-retro-gold rounded-full transform -translate-y-1/2"></div>
        <div className="absolute right-2 top-1/2 w-1 h-1 bg-neon-pink rounded-full transform -translate-y-1/2"></div>
      </div>
    </div>
  )
}

// Compact version for navbar
export function WMXLogoCompact({ className, width = 40, height = 40 }: WMXLogoProps) {
  return (
    <div className={cn("relative inline-block", className)} style={{ width, height }}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-glow-magenta"
      >
        {/* Compact Diamond */}
        <path
          d="M40 8 L64 28 L64 52 L40 72 L16 52 L16 28 Z"
          fill="url(#compactGradient)"
          stroke="url(#compactBorder)"
          strokeWidth="2"
        />
        
        {/* Diamond Icon */}
        <g transform="translate(40, 25)">
          <path
            d="M0 -6 L-5 0 L0 10 L5 0 Z"
            fill="#00FFFF"
            stroke="#FFD700"
            strokeWidth="1"
          />
        </g>
        
        {/* WMX Text */}
        <text
          x="40"
          y="50"
          textAnchor="middle"
          className="font-heading font-black text-sm"
          fill="url(#compactText)"
        >
          WMX
        </text>
        
        <defs>
          <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
          
          <linearGradient id="compactBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="50%" stopColor="#FF00FF" />
            <stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
          
          <linearGradient id="compactText" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FFFF" />
            <stop offset="100%" stopColor="#FF00FF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
