'use client'

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface WMXLogoPNGProps {
  width?: number
  height?: number
  className?: string
  alt?: string
}

export function WMXLogoPNG({
  width = 120,
  height = 120,
  className,
  alt = "WMX TOPUP Services Logo"
}: WMXLogoPNGProps) {
  return (
    <Image
      src="/images/wmx-logo.png"
      alt={alt}
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  )
}

export function WMXLogoPNGCompact({
  width = 48,
  height = 48,
  className,
  alt = "WMX TOPUP Logo"
}: WMXLogoPNGProps) {
  return (
    <WMXLogoPNG
      width={width}
      height={height}
      className={className}
      alt={alt}
    />
  )
}
