'use client'

import * as React from "react"
import { motion, type Variants } from "framer-motion"

// Fade in animation
const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Slide up animation
const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Slide in from left
const slideInLeftVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -30 
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Slide in from right
const slideInRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 30 
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Scale animation
const scaleVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8 
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
}

// Stagger container
const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Stagger item
const staggerItemVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

interface AnimatedProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Fade In Component
export function FadeIn({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Slide Up Component
export function SlideUp({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={slideUpVariants}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Slide In Left Component
export function SlideInLeft({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={slideInLeftVariants}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Slide In Right Component
export function SlideInRight({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={slideInRightVariants}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Scale Component
export function Scale({ children, className, delay = 0 }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={scaleVariants}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </motion.div>
  )
}

// Stagger Container
export function StaggerContainer({ children, className }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerContainerVariants}
    >
      {children}
    </motion.div>
  )
}

// Stagger Item
export function StaggerItem({ children, className }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  )
}

// Hover Scale Effect
interface HoverScaleProps extends AnimatedProps {
  scale?: number
}

export function HoverScale({ children, className, scale = 1.05 }: HoverScaleProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale: scale,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  )
}

// Float Animation
export function Float({ children, className }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}

// Glow Pulse
export function GlowPulse({ children, className }: AnimatedProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          "0 0 20px rgba(59, 130, 246, 0.3)",
          "0 0 30px rgba(108, 99, 255, 0.4)",
          "0 0 20px rgba(59, 130, 246, 0.3)"
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  )
}
