import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PromoSection = ({ promoOffers }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()?.getTime();
      const newTimeLeft = {};

      promoOffers?.forEach(offer => {
        if (offer?.endTime) {
          const distance = new Date(offer.endTime)?.getTime() - now;
          
          if (distance > 0) {
            newTimeLeft[offer.id] = {
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };
          }
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [promoOffers]);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoOffers?.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [promoOffers?.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(price);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promoOffers?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promoOffers?.length) % promoOffers?.length);
  };

  if (!promoOffers || promoOffers?.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gaming-gold to-yellow-500 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-gaming font-bold text-gold-gradient">Promo Spesial</h2>
            <p className="text-sm text-text-secondary">Jangan sampai terlewat, penawaran terbatas!</p>
          </div>
        </div>
      </div>
      {/* Main Promo Carousel */}
      <div className="relative mb-8">
        <div className="overflow-hidden rounded-xl">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {promoOffers?.map((offer) => (
              <div key={offer?.id} className="w-full flex-shrink-0">
                <div className="relative bg-gradient-to-r from-gaming-gold/20 to-yellow-500/20 rounded-xl border border-gaming-gold/30 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />
                  
                  {/* Background Image */}
                  <Image 
                    src={offer?.backgroundImage} 
                    alt={offer?.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />

                  <div className="relative z-20 p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      {/* Promo Content */}
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-gaming-gold text-black text-xs font-bold px-3 py-1 rounded-full">
                            {offer?.badge}
                          </span>
                          {offer?.isLimited && (
                            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                              TERBATAS
                            </span>
                          )}
                        </div>

                        <h3 className="text-3xl md:text-4xl font-gaming font-bold text-gaming-gold mb-4">
                          {offer?.title}
                        </h3>
                        
                        <p className="text-lg text-foreground mb-6">{offer?.description}</p>

                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gaming-gold">{offer?.discount}%</div>
                            <div className="text-xs text-text-secondary">DISKON</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg text-foreground">
                              <span className="line-through text-text-secondary mr-2">
                                {formatPrice(offer?.originalPrice)}
                              </span>
                              <span className="font-bold text-gaming-gold">
                                {formatPrice(offer?.discountedPrice)}
                              </span>
                            </div>
                            <div className="text-xs text-text-secondary">Harga Promo</div>
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        {timeLeft?.[offer?.id] && (
                          <div className="mb-6">
                            <div className="text-sm text-text-secondary mb-2">Berakhir dalam:</div>
                            <div className="flex gap-2">
                              {Object.entries(timeLeft?.[offer?.id])?.map(([unit, value]) => (
                                <div key={unit} className="bg-black/50 rounded-lg px-3 py-2 text-center min-w-[60px]">
                                  <div className="text-lg font-bold text-gaming-gold">{value}</div>
                                  <div className="text-xs text-text-secondary capitalize">{unit}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <Button
                          variant="default"
                          size="lg"
                          className="bg-gradient-to-r from-gaming-gold to-yellow-500 text-black hover:shadow-neon-glow font-gaming font-bold"
                        >
                          <Icon name="ShoppingCart" size={20} className="mr-2" />
                          Ambil Promo Sekarang
                        </Button>
                      </div>

                      {/* Game Preview */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <Image 
                            src={offer?.gameImage} 
                            alt={offer?.gameName}
                            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl shadow-gaming-lg"
                          />
                          <div className="absolute -bottom-4 -right-4 bg-gaming-gold text-black px-4 py-2 rounded-lg font-bold">
                            {offer?.gameName}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 z-30"
        >
          <Icon name="ChevronLeft" size={24} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all duration-200 z-30"
        >
          <Icon name="ChevronRight" size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {promoOffers?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-gaming-gold shadow-neon-glow' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
      {/* Quick Promo Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promoOffers?.slice(0, 3)?.map((offer) => (
          <div key={`quick-${offer?.id}`} className="bg-surface/30 rounded-lg p-4 border border-gaming-gold/30 hover:border-gaming-gold/50 transition-all duration-200">
            <div className="flex items-center gap-3 mb-3">
              <Image 
                src={offer?.gameIcon} 
                alt={offer?.gameName}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-gaming font-bold text-foreground">{offer?.gameName}</h4>
                <p className="text-xs text-gaming-gold">{offer?.discount}% OFF</p>
              </div>
            </div>
            
            <div className="text-sm text-text-secondary mb-3">{offer?.shortDescription}</div>
            
            <Button variant="outline" size="sm" fullWidth className="border-gaming-gold/30 text-gaming-gold hover:bg-gaming-gold/10">
              Lihat Detail
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromoSection;