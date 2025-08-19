import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import LiveTrendsSection from './components/LiveTrendsSection';
import FeaturedGamesCarousel from './components/FeaturedGamesCarousel';
import TrustSignalsBar from './components/TrustSignalsBar';
import WhyChooseSection from './components/WhyChooseSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

const HomepageGamingCommerceHub = () => {
  useEffect(() => {
    // Set page title
    document.title = 'WMX TOPUP - Your Gaming Success, Secured | #1 Gaming Commerce Hub Indonesia';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription?.setAttribute('content', 'Platform top-up gaming terpercaya #1 di Indonesia. Transaksi aman, cepat 30 detik, dan terpercaya untuk Mobile Legends, Free Fire, PUBG Mobile, Genshin Impact dan game favorit lainnya.');
    }

    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Live Gaming Trends */}
        <LiveTrendsSection />

        {/* Featured Games Carousel */}
        <FeaturedGamesCarousel />

        {/* Trust Signals Bar */}
        <TrustSignalsBar />

        {/* Why Choose WMX TOPUP */}
        <WhyChooseSection />

        {/* Customer Testimonials */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomepageGamingCommerceHub;