import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LoyaltyProgram = ({ loyaltyData, rewards, exclusiveOffers }) => {
  const tiers = [
    { name: 'Bronze', min: 0, max: 999999, color: '#cd7f32', icon: 'Award' },
    { name: 'Silver', min: 1000000, max: 4999999, color: '#c0c0c0', icon: 'Medal' },
    { name: 'Gold', min: 5000000, max: 9999999, color: '#ffd700', icon: 'Crown' },
    { name: 'Platinum', min: 10000000, max: 24999999, color: '#e5e4e2', icon: 'Gem' },
    { name: 'Diamond', min: 25000000, max: Infinity, color: '#b9f2ff', icon: 'Diamond' }
  ];

  const getCurrentTier = () => {
    return tiers?.find(tier => 
      loyaltyData?.totalSpent >= tier?.min && loyaltyData?.totalSpent <= tier?.max
    );
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = tiers?.findIndex(tier => tier?.name === currentTier?.name);
    return currentIndex < tiers?.length - 1 ? tiers?.[currentIndex + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    
    const currentTier = getCurrentTier();
    const progress = ((loyaltyData?.totalSpent - currentTier?.min) / (nextTier?.min - currentTier?.min)) * 100;
    return Math.min(progress, 100);
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const progressPercentage = getProgressToNextTier();

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="Crown" size={24} className="text-primary mr-3" />
          Program Loyalitas
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Info" size={16} className="mr-2" />
          Info Program
        </Button>
      </div>
      {/* Current Tier Status */}
      <div className="bg-gradient-to-r from-surface to-muted rounded-lg p-6 mb-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-neon-glow"
              style={{ backgroundColor: currentTier?.color + '20', border: `2px solid ${currentTier?.color}` }}
            >
              <Icon name={currentTier?.icon} size={24} style={{ color: currentTier?.color }} />
            </div>
            <div>
              <h3 className="text-2xl font-gaming font-bold text-gaming-gradient">
                {currentTier?.name} Member
              </h3>
              <p className="text-text-secondary">
                Total Pengeluaran: Rp {loyaltyData?.totalSpent?.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{loyaltyData?.points}</div>
            <div className="text-sm text-text-secondary">Poin Tersedia</div>
          </div>
        </div>

        {nextTier && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">
                Progress ke {nextTier?.name}
              </span>
              <span className="text-sm text-foreground">
                Rp {(nextTier?.min - loyaltyData?.totalSpent)?.toLocaleString('id-ID')} lagi
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500 shadow-neon-glow"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      {/* Tier Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Gift" size={20} className="text-primary mr-2" />
            Benefit {currentTier?.name}
          </h4>
          <div className="space-y-3">
            {loyaltyData?.currentBenefits?.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Icon name="Check" size={16} className="text-success" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Star" size={20} className="text-gaming-gold mr-2" />
            Reward Tersedia
          </h4>
          <div className="space-y-3">
            {rewards?.slice(0, 4)?.map((reward) => (
              <div key={reward?.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon name={reward?.icon} size={16} className="text-primary" />
                  <span className="text-sm text-foreground">{reward?.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-primary">
                    {reward?.points} pts
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:bg-primary/10 p-1"
                    disabled={loyaltyData?.points < reward?.points}
                  >
                    <Icon name="ArrowRight" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Exclusive Offers */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Sparkles" size={20} className="text-secondary mr-2" />
          Penawaran Eksklusif
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exclusiveOffers?.map((offer) => (
            <div
              key={offer?.id}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 border border-primary/20 hover:border-primary/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Image
                    src={offer?.gameIcon}
                    alt={offer?.gameName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h5 className="font-semibold text-foreground">{offer?.title}</h5>
                    <p className="text-sm text-text-secondary">{offer?.gameName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-error line-through">
                    Rp {offer?.originalPrice?.toLocaleString('id-ID')}
                  </div>
                  <div className="text-lg font-bold text-primary">
                    Rp {offer?.discountedPrice?.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="px-2 py-1 bg-error/20 text-error rounded-full text-xs font-medium">
                    -{offer?.discount}%
                  </div>
                  <div className="px-2 py-1 bg-warning/20 text-warning rounded-full text-xs">
                    {offer?.timeLeft}
                  </div>
                </div>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
                >
                  Klaim Sekarang
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Tier Progression */}
      <div className="mt-8 p-4 bg-surface rounded-lg border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="TrendingUp" size={20} className="text-primary mr-2" />
          Jenjang Keanggotaan
        </h4>
        <div className="flex items-center justify-between">
          {tiers?.map((tier, index) => (
            <div key={tier?.name} className="flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                  currentTier?.name === tier?.name
                    ? 'shadow-neon-glow scale-110'
                    : loyaltyData?.totalSpent >= tier?.min
                    ? 'opacity-100' :'opacity-40'
                }`}
                style={{ 
                  backgroundColor: tier?.color + '20', 
                  border: `2px solid ${tier?.color}` 
                }}
              >
                <Icon name={tier?.icon} size={20} style={{ color: tier?.color }} />
              </div>
              <span className={`text-xs font-medium ${
                currentTier?.name === tier?.name ? 'text-primary' : 'text-text-secondary'
              }`}>
                {tier?.name}
              </span>
              {index < tiers?.length - 1 && (
                <div className="hidden md:block w-8 h-px bg-border mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;