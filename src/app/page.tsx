import { RootLayout } from "@/components/layout/root-layout"
import { HeroArcade } from "@/components/sections/hero-arcade"
import { PromoBanner } from "@/components/sections/promo-banner"
import { HowItWorks } from "@/components/sections/how-it-works"
import { PopularGames } from "@/components/sections/popular-games"
import { Testimonials } from "@/components/sections/testimonials"
import { TrustPartners } from "@/components/sections/trust-partners"

export default function Home() {
  return (
    <RootLayout>
      <HeroArcade />
      <PromoBanner />
      <HowItWorks />
      <PopularGames />
      <Testimonials />
      <TrustPartners />
    </RootLayout>
  )
}
