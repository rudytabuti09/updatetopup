import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ orderData }) => {
  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  return (
    <div className="gaming-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="ShoppingCart" size={24} className="text-primary" />
        <h2 className="text-xl font-gaming font-bold text-foreground">Ringkasan Pesanan</h2>
      </div>
      <div className="space-y-4">
        {/* Game Item */}
        <div className="flex items-center space-x-4 p-4 bg-surface/50 rounded-lg border border-border/50">
          <div className="relative">
            <Image
              src={orderData?.game?.logo}
              alt={orderData?.game?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">{orderData?.quantity}</span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{orderData?.game?.name}</h3>
            <p className="text-sm text-text-secondary">{orderData?.package?.name}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Icon name="Zap" size={14} className="text-gaming-gold" />
              <span className="text-sm text-gaming-gold font-medium">
                {orderData?.package?.amount} {orderData?.package?.currency}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="font-bold text-foreground">{formatIDR(orderData?.package?.price)}</p>
            {orderData?.package?.discount > 0 && (
              <p className="text-xs text-text-secondary line-through">
                {formatIDR(orderData?.package?.originalPrice)}
              </p>
            )}
          </div>
        </div>

        {/* Discount Section */}
        {orderData?.discount && (
          <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center space-x-2">
              <Icon name="Tag" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">Diskon: {orderData?.discount?.code}</span>
            </div>
            <span className="text-sm font-bold text-success">-{formatIDR(orderData?.discount?.amount)}</span>
          </div>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span className="text-foreground">{formatIDR(orderData?.subtotal)}</span>
          </div>
          
          {orderData?.discount && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Diskon</span>
              <span className="text-success">-{formatIDR(orderData?.discount?.amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Biaya Admin</span>
            <span className="text-foreground">{formatIDR(orderData?.adminFee)}</span>
          </div>
          
          <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
            <span className="text-foreground">Total</span>
            <span className="text-primary">{formatIDR(orderData?.total)}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center space-x-2 p-3 bg-primary/10 rounded-lg">
          <Icon name="Clock" size={16} className="text-primary" />
          <span className="text-sm text-primary font-medium">
            Pengiriman instan setelah pembayaran berhasil
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;