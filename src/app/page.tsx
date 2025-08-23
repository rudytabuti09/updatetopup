import { RootLayout } from "@/components/layout/root-layout"
import { HeroSection } from "@/components/sections/hero-section"
import { PromoBanner } from "@/components/sections/promo-banner"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PopularGames } from "@/components/sections/popular-games"
import { AuthDebug } from "@/components/debug/auth-debug"

export default function Home() {
  return (
    <RootLayout>
      <HeroSection />
      <PromoBanner />
      <HowItWorks />
      <PopularGames />
      <AuthDebug />
    </RootLayout>
  )
}
