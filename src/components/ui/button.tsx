import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none relative overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-neon-magenta to-neon-cyan text-white shadow-neon hover:shadow-glow-magenta hover:scale-105 font-heading uppercase tracking-wider",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:shadow-glow-magenta",
        outline:
          "border-2 border-neon-magenta bg-white/80 backdrop-blur-sm text-neon-magenta hover:bg-neon-magenta hover:text-white hover:shadow-glow-magenta transition-all",
        secondary:
          "bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-glow-cyan hover:scale-105 font-retro",
        ghost:
          "hover:bg-neon-magenta/10 text-neon-magenta hover:text-neon-cyan transition-colors",
        link: "text-neon-magenta underline-offset-4 hover:underline hover:text-neon-cyan",
        retro:
          "bg-gradient-to-r from-retro-gold to-retro-orange text-wmx-dark font-retro uppercase tracking-wide hover:shadow-glow-gold hover:scale-105 border-2 border-transparent hover:border-retro-gold",
        neon:
          "bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-wmx-dark hover:shadow-neon transition-all font-heading uppercase",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
