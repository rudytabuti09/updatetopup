import { RootLayout } from "@/components/layout/root-layout"
import { HeroArcade } from "@/components/sections/hero-arcade"
import { PromoBanner } from "@/components/sections/promo-banner"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PopularGames } from "@/components/sections/popular-games"
import { AuthDebug } from "@/components/debug/auth-debug"
import { SessionDebug } from "@/components/debug/session-debug"
import { NextAuthTest } from "@/components/debug/nextauth-test"

export default function Home() {
  return (
    <RootLayout>
      <HeroArcade />
      <PromoBanner />
      <HowItWorks />
      <PopularGames />
      <AuthDebug />
      <SessionDebug />
      <NextAuthTest />
    </RootLayout>
  )
}
