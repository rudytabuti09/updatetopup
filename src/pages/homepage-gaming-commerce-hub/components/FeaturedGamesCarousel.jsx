import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FeaturedGamesCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredGames = [
    {
      id: 1,
      name: "Mobile Legends: Bang Bang",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop&crop=center",
      background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop&crop=center",
      category: "MOBA",
      promotion: "Bonus 20% Diamond",
      originalPrice: "Rp 50.000",
      discountPrice: "Rp 40.000",
      discount: "20%",
      description: "Dapatkan diamond dengan bonus terbesar untuk hero dan skin favoritmu!",
      features: ["Instant Delivery", "24/7 Support", "Secure Payment"],
      rating: 4.9,
      totalUsers: "2.1M+"
    },
    {
      id: 2,
      name: "Free Fire",
      logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop&crop=center",
      background: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=400&fit=crop&crop=center",
      category: "Battle Royale",
      promotion: "Mega Sale Diamond",
      originalPrice: "Rp 100.000",
      discountPrice: "Rp 75.000",
      discount: "25%",
      description: "Koleksi skin legendary dan weapon terbaru dengan harga spesial!",
      features: ["Fast Top-up", "Best Price", "Official Partner"],
      rating: 4.8,
      totalUsers: "1.8M+"
    },
    {
      id: 3,
      name: "Genshin Impact",
      logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=center",
      background: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop&crop=center",
      category: "RPG",
      promotion: "Genesis Crystal Bonus",
      originalPrice: "Rp 150.000",
      discountPrice: "Rp 120.000",
      discount: "20%",
      description: "Wishing untuk character 5-star impianmu dengan crystal bonus!",
      features: ["Instant Crystal", "Bonus Rewards", "Safe Transaction"],
      rating: 4.9,
      totalUsers: "890K+"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredGames?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredGames?.length) % featuredGames?.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="Star" size={20} className="text-gaming-gold" />
            <span className="text-gaming-gold font-accent font-bold uppercase tracking-wider text-sm">
              Featured Games
            </span>
            <Icon name="Star" size={20} className="text-gaming-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-gaming font-bold text-gaming-gradient mb-6">
            Promo Spesial Hari Ini
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Jangan lewatkan penawaran terbaik untuk game favoritmu dengan diskon hingga 25%
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {featuredGames?.map((game) => (
                <div key={game?.id} className="w-full flex-shrink-0">
                  <div className="gaming-card overflow-hidden">
                    {/* Background Image */}
                    <div className="relative h-96 md:h-80">
                      <Image 
                        src={game?.background} 
                        alt={game?.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Discount Badge */}
                      <div className="absolute top-6 right-6 bg-error text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                        -{game?.discount} OFF
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full px-8 md:px-12">
                          <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Left Content */}
                            <div>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-primary shadow-neon-blue">
                                  <Image 
                                    src={game?.logo} 
                                    alt={game?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-primary text-sm font-medium bg-primary/20 px-3 py-1 rounded-full inline-block mb-2">
                                    {game?.category}
                                  </div>
                                  <h3 className="text-2xl md:text-3xl font-gaming font-bold text-white">
                                    {game?.name}
                                  </h3>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="text-xl font-bold text-gaming-gold mb-2">
                                  {game?.promotion}
                                </h4>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                  {game?.description}
                                </p>
                              </div>

                              {/* Features */}
                              <div className="flex flex-wrap gap-3 mb-6">
                                {game?.features?.map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <Icon name="Check" size={14} className="text-success" />
                                    <span className="text-white text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Rating & Users */}
                              <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                  <div className="flex">
                                    {[...Array(5)]?.map((_, i) => (
                                      <Icon 
                                        key={i} 
                                        name="Star" 
                                        size={16} 
                                        className={i < Math.floor(game?.rating) ? "text-gaming-gold" : "text-gray-400"} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-white font-medium">{game?.rating}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Icon name="Users" size={16} className="text-primary" />
                                  <span className="text-white">{game?.totalUsers} users</span>
                                </div>
                              </div>
                            </div>

                            {/* Right Content - Pricing & CTA */}
                            <div className="text-center md:text-right">
                              <div className="glass-card p-6 rounded-xl">
                                <div className="mb-4">
                                  <div className="text-text-secondary line-through text-lg mb-1">
                                    {game?.originalPrice}
                                  </div>
                                  <div className="text-3xl font-gaming font-bold text-gaming-gold mb-2">
                                    {game?.discountPrice}
                                  </div>
                                  <div className="text-success text-sm font-medium">
                                    Hemat {parseInt(game?.originalPrice?.replace(/\D/g, '')) - parseInt(game?.discountPrice?.replace(/\D/g, ''))} IDR
                                  </div>
                                </div>

                                <Link to="/streamlined-checkout-flow">
                                  <Button 
                                    variant="default" 
                                    size="lg"
                                    fullWidth
                                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow mb-3"
                                    iconName="ShoppingCart"
                                    iconPosition="left"
                                  >
                                    Beli Sekarang
                                  </Button>
                                </Link>

                                <Link to="/game-selection-hub">
                                  <Button 
                                    variant="outline" 
                                    size="default"
                                    fullWidth
                                    className="border-white/30 text-white hover:bg-white/10"
                                  >
                                    Lihat Detail
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Icon name="ChevronLeft" size={24} className="text-white" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Icon name="ChevronRight" size={24} className="text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-8">
            {featuredGames?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-primary shadow-neon-blue' 
                    : 'bg-border hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGamesCarousel;