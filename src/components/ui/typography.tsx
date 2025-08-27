import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Display component for hero sections and major headings
const displayVariants = cva(
  "font-heading font-bold tracking-tight",
  {
    variants: {
      size: {
        sm: "text-fluid-4xl",
        md: "text-fluid-5xl",
        lg: "text-fluid-6xl",
        xl: "text-fluid-7xl",
        "2xl": "text-fluid-8xl",
        "3xl": "text-fluid-9xl",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        neon: "text-neon",
        "neon-magenta": "text-glow-magenta",
        "neon-cyan": "text-glow-cyan",
        "retro-gold": "text-retro-gold",
        gradient: "gradient-text",
        cyber: "cyber-text",
      }
    },
    defaultVariants: {
      size: "lg",
      color: "default"
    }
  }
)

export interface DisplayProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof displayVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div"
}

const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ className, size, color, as: Component = "h1", ...props }, ref) => {
    return (
      <Component
        className={cn(displayVariants({ size, color, className }))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...props}
      />
    )
  }
)
Display.displayName = "Display"

// Heading component for section headings
const headingVariants = cva(
  "font-heading font-semibold tracking-tight",
  {
    variants: {
      size: {
        xs: "text-fluid-sm",
        sm: "text-fluid-base",
        md: "text-fluid-lg",
        lg: "text-fluid-xl",
        xl: "text-fluid-2xl",
        "2xl": "text-fluid-3xl",
        "3xl": "text-fluid-4xl",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        neon: "text-neon",
        "neon-magenta": "text-glow-magenta",
        "neon-cyan": "text-glow-cyan",
        "retro-gold": "text-retro-gold",
        gradient: "gradient-text",
        cyber: "cyber-text",
      }
    },
    defaultVariants: {
      size: "lg",
      color: "default"
    }
  }
)

export interface HeadingProps
  extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div"
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, color, as: Component = "h2", ...props }, ref) => {
    return (
      <Component
        className={cn(headingVariants({ size, color, className }))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...props}
      />
    )
  }
)
Heading.displayName = "Heading"

// Text component for body text and paragraphs
const textVariants = cva(
  "font-sans",
  {
    variants: {
      size: {
        xs: "text-fluid-xs",
        sm: "text-fluid-sm",
        base: "text-fluid-base",
        lg: "text-fluid-lg",
        xl: "text-fluid-xl",
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        neon: "text-neon",
        "neon-magenta": "text-glow-magenta",
        "neon-cyan": "text-glow-cyan",
        "retro-gold": "text-retro-gold",
        gradient: "gradient-text",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      }
    },
    defaultVariants: {
      size: "base",
      weight: "normal",
      color: "default",
      align: "left"
    }
  }
)

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div" | "label" | "small"
  balance?: boolean
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, size, weight, color, align, as: Component = "p", balance = false, ...props }, ref) => {
    return (
      <Component
        className={cn(
          textVariants({ size, weight, color, align, className }),
          balance && "text-balance"
        )}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...props}
      />
    )
  }
)
Text.displayName = "Text"

// Caption component for small text and descriptions
const captionVariants = cva(
  "font-sans text-fluid-xs text-muted-foreground",
  {
    variants: {
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
      },
      color: {
        default: "text-muted-foreground",
        foreground: "text-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        neon: "text-neon-cyan opacity-70",
      }
    },
    defaultVariants: {
      weight: "normal",
      color: "default"
    }
  }
)

export interface CaptionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof captionVariants> {
  as?: "small" | "span" | "p" | "div"
}

const Caption = React.forwardRef<HTMLElement, CaptionProps>(
  ({ className, weight, color, as: Component = "small", ...props }, ref) => {
    return (
      <Component
        className={cn(captionVariants({ weight, color, className }))}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        {...props}
      />
    )
  }
)
Caption.displayName = "Caption"

// Lead component for emphasized introductory text
const leadVariants = cva(
  "font-sans text-fluid-lg text-muted-foreground font-light leading-relaxed",
  {
    variants: {
      color: {
        default: "text-muted-foreground",
        foreground: "text-foreground",
        accent: "text-accent-foreground",
        neon: "text-neon-cyan opacity-80",
      }
    },
    defaultVariants: {
      color: "default"
    }
  }
)

export interface LeadProps
  extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'>,
    VariantProps<typeof leadVariants> {
  balance?: boolean
}

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(
  ({ className, color, balance = false, ...props }, ref) => {
    return (
      <p
        className={cn(
          leadVariants({ color, className }),
          balance && "text-balance"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Lead.displayName = "Lead"

// Code component for inline code
const Code = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <code
    ref={ref}
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-fluid-sm font-semibold",
      className
    )}
    {...props}
  />
))
Code.displayName = "Code"

// Muted text component
const Muted = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-fluid-sm text-muted-foreground", className)}
    {...props}
  />
))
Muted.displayName = "Muted"

// Blockquote component
const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.HTMLAttributes<HTMLQuoteElement>
>(({ className, ...props }, ref) => (
  <blockquote
    ref={ref}
    className={cn(
      "mt-6 border-l-2 border-primary/20 pl-6 italic text-fluid-lg font-light",
      className
    )}
    {...props}
  />
))
Blockquote.displayName = "Blockquote"

// List components
const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn("my-6 ml-6 list-disc text-fluid-base space-y-2", className)} {...props} />
))
List.displayName = "List"

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
ListItem.displayName = "ListItem"

export {
  Display,
  Heading,
  Text,
  Caption,
  Lead,
  Code,
  Muted,
  Blockquote,
  List,
  ListItem,
  displayVariants,
  headingVariants,
  textVariants,
  captionVariants,
  leadVariants
}
