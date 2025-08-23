/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Retro-Modern Neon Colors
        neon: {
          magenta: "#FF00FF",
          cyan: "#00FFFF",
          blue: "#3B82F6",
          purple: "#8B5CF6",
          pink: "#EC4899",
          green: "#00FF88",
        },
        retro: {
          gold: "#FFD700",
          orange: "#FF6B35",
          sunset: "#FF4E50",
          sky: "#87CEEB",
          lavender: "#E6E6FA",
        },
        wmx: {
          light: "#F8F9FE",
          dark: "#1A1A2E",
          gray: {
            50: "#FAFBFC",
            100: "#F3F4F6",
            200: "#E5E7EB",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
            900: "#111827",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Orbitron", "Oxanium", "system-ui", "sans-serif"],
        retro: ["Oxanium", "Orbitron", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255, 0, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(0, 255, 255, 0.4)" },
        },
        "neon-pulse": {
          "0%, 100%": { 
            opacity: "1",
            boxShadow: "0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3)"
          },
          "50%": { 
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(255, 0, 255, 0.7), 0 0 60px rgba(0, 255, 255, 0.5)"
          },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "grid-scroll": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "50px 50px" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
        "neon-pulse": "neon-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan-line 8s linear infinite",
        "grid-scroll": "grid-scroll 10s linear infinite",
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(135deg, #FF00FF, #00FFFF)",
        "gradient-retro": "linear-gradient(135deg, #FFD700, #FF6B35)",
        "gradient-sunset": "linear-gradient(135deg, #FF4E50, #FC913A)",
        "gradient-cyber": "linear-gradient(135deg, #8B5CF6, #EC4899)",
        "gradient-light": "linear-gradient(180deg, #E0E7FF 0%, #FECACA 50%, #FEF3C7 100%)",
        "grid-retro": "linear-gradient(0deg, transparent 24%, rgba(255, 0, 255, 0.05) 25%, rgba(255, 0, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(255, 0, 255, 0.05) 75%, rgba(255, 0, 255, 0.05) 76%, transparent 77%, transparent)",
      },
      boxShadow: {
        "glow-magenta": "0 0 20px rgba(255, 0, 255, 0.4)",
        "glow-cyan": "0 0 20px rgba(0, 255, 255, 0.4)",
        "glow-gold": "0 0 20px rgba(255, 215, 0, 0.4)",
        "neon": "0 0 30px rgba(255, 0, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.2)",
        "retro": "4px 4px 0px #FF6B35, 8px 8px 0px rgba(255, 107, 53, 0.4)",
        "glass": "0 8px 32px rgba(31, 38, 135, 0.15)",
        "card-hover": "0 20px 40px rgba(255, 0, 255, 0.15), 0 10px 20px rgba(0, 255, 255, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
