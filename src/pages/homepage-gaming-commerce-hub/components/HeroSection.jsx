import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-background">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-gaming-gold rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-primary rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-secondary rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Neon Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Main Headline */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-gaming font-bold text-gaming-gradient mb-6 leading-tight">
            Your Gaming Success, Secured
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan jutaan gamer Indonesia yang mempercayai WMX TOPUP untuk pengalaman top-up gaming yang aman, cepat, dan terpercaya.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Link to="/game-selection-hub">
            <Button 
              variant="default" 
              size="xl"
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow transform hover:scale-105 transition-all duration-300"
              iconName="Zap"
              iconPosition="left"
            >
              Top Up Sekarang
            </Button>
          </Link>
          <Link to="/game-selection-hub">
            <Button 
              variant="outline" 
              size="xl"
              className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
              iconName="Gamepad2"
              iconPosition="left"
            >
              Jelajahi Game
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-text-secondary">
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={20} className="text-success" />
            <span className="text-sm font-medium">100% Aman</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Zap" size={20} className="text-primary" />
            <span className="text-sm font-medium">Instan 30 Detik</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={20} className="text-secondary" />
            <span className="text-sm font-medium">2M+ Gamer Terpercaya</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={20} className="text-gaming-gold" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDown" size={24} className="text-text-secondary" />
      </div>
    </section>
  );
};

export default HeroSection;