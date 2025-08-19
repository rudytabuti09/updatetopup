import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WishlistManager = ({ wishlistItems, onRemoveItem, onPriceAlert }) => {
  const [showAll, setShowAll] = useState(false);
  const [alertSettings, setAlertSettings] = useState({});

  const displayedItems = showAll ? wishlistItems : wishlistItems?.slice(0, 4);

  const togglePriceAlert = (itemId) => {
    setAlertSettings(prev => ({
      ...prev,
      [itemId]: !prev?.[itemId]
    }));
    onPriceAlert(itemId, !alertSettings?.[itemId]);
  };

  const formatPrice = (price) => {
    return `Rp ${price?.toLocaleString('id-ID')}`;
  };

  const getDiscountPercentage = (originalPrice, currentPrice) => {
    if (originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="Heart" size={24} className="text-primary mr-3" />
          Wishlist Saya
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-secondary">
            {wishlistItems?.length} item
          </span>
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            <Icon name="Settings" size={16} className="mr-2" />
            Kelola
          </Button>
        </div>
      </div>
      {wishlistItems?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Heart" size={48} className="text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Wishlist Kosong
          </h3>
          <p className="text-text-secondary mb-6">
            Tambahkan game dan paket favorit Anda ke wishlist
          </p>
          <Button
            variant="default"
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Jelajahi Game
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedItems?.map((item) => {
              const discountPercentage = getDiscountPercentage(item?.originalPrice, item?.currentPrice);
              const hasDiscount = discountPercentage > 0;
              const isPriceAlertActive = alertSettings?.[item?.id];

              return (
                <div
                  key={item?.id}
                  className="bg-surface rounded-lg p-4 border border-border hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Image
                        src={item?.gameIcon}
                        alt={item?.gameName}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      {hasDiscount && (
                        <div className="absolute -top-2 -right-2 bg-error text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{discountPercentage}%
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item?.gameName}
                      </h4>
                      <p className="text-sm text-text-secondary mb-2">
                        {item?.packageName}
                      </p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="font-bold text-primary">
                          {formatPrice(item?.currentPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-sm text-text-secondary line-through">
                            {formatPrice(item?.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => togglePriceAlert(item?.id)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-all duration-200 ${
                              isPriceAlertActive
                                ? 'bg-warning/20 text-warning border border-warning/30' :'bg-muted text-text-secondary hover:bg-warning/10 hover:text-warning'
                            }`}
                          >
                            <Icon name="Bell" size={12} />
                            <span>Alert</span>
                          </button>
                          
                          {item?.isOnSale && (
                            <div className="flex items-center space-x-1 px-2 py-1 bg-success/20 text-success rounded-full text-xs">
                              <Icon name="Tag" size={12} />
                              <span>Sale</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:bg-primary/10 p-2"
                            onClick={() => console.log(`Buy now: ${item?.id}`)}
                          >
                            <Icon name="ShoppingCart" size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:bg-error/10 p-2"
                            onClick={() => onRemoveItem(item?.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {wishlistItems?.length > 4 && (
            <div className="text-center mt-6">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                {showAll ? (
                  <>
                    <Icon name="ChevronUp" size={16} className="mr-2" />
                    Tampilkan Lebih Sedikit
                  </>
                ) : (
                  <>
                    <Icon name="ChevronDown" size={16} className="mr-2" />
                    Tampilkan Semua ({wishlistItems?.length - 4} lainnya)
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WishlistManager;