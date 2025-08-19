import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CheckoutActions = ({ 
  orderData, 
  selectedPaymentMethod, 
  isProcessing, 
  onProcessPayment, 
  onBack 
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const formatIDR = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const canProceed = selectedPaymentMethod && agreedToTerms && agreedToPrivacy && !isProcessing;

  const handlePayment = () => {
    if (canProceed) {
      onProcessPayment();
    }
  };

  return (
    <div className="gaming-card p-6 sticky bottom-4">
      {/* Agreement Checkboxes */}
      <div className="space-y-3 mb-6">
        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e?.target?.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                agreedToTerms
                  ? 'bg-primary border-primary' :'border-border hover:border-primary/50'
              }`}
            >
              {agreedToTerms && (
                <Icon name="Check" size={14} className="text-black" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              Saya menyetujui{' '}
              <button className="text-primary hover:underline font-medium">
                Syarat dan Ketentuan
              </button>{' '}
              WMX TOPUP
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <div className="relative mt-1">
            <input
              type="checkbox"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e?.target?.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                agreedToPrivacy
                  ? 'bg-primary border-primary' :'border-border hover:border-primary/50'
              }`}
            >
              {agreedToPrivacy && (
                <Icon name="Check" size={14} className="text-black" />
              )}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-foreground">
              Saya telah membaca dan memahami{' '}
              <button className="text-primary hover:underline font-medium">
                Kebijakan Privasi
              </button>
            </p>
          </div>
        </label>
      </div>
      {/* Payment Summary */}
      <div className="bg-surface/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-text-secondary">Total Pembayaran</span>
          <span className="text-2xl font-bold text-primary">{formatIDR(orderData?.total)}</span>
        </div>
        
        {selectedPaymentMethod && (
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="CreditCard" size={14} />
            <span>via {selectedPaymentMethod?.name}</span>
            {selectedPaymentMethod?.fee > 0 && (
              <span className="text-xs">
                (+ {formatIDR(selectedPaymentMethod?.fee)} biaya admin)
              </span>
            )}
          </div>
        )}
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          iconName="ArrowLeft"
          iconPosition="left"
          className="sm:w-auto"
        >
          Kembali
        </Button>

        <Button
          variant="default"
          onClick={handlePayment}
          disabled={!canProceed}
          loading={isProcessing}
          iconName={isProcessing ? undefined : "CreditCard"}
          iconPosition="left"
          fullWidth
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
        >
          {isProcessing ? 'Memproses Pembayaran...' : `Bayar ${formatIDR(orderData?.total)}`}
        </Button>
      </div>
      {/* Security Notice */}
      <div className="mt-4 p-3 bg-success/10 rounded-lg border border-success/20">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <p className="text-xs text-success">
            Transaksi Anda dilindungi dengan enkripsi SSL 256-bit dan standar keamanan PCI DSS
          </p>
        </div>
      </div>
      {/* Processing Info */}
      {isProcessing && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-medium text-primary">Sedang Memproses Pembayaran</p>
              <p className="text-xs text-primary/80">
                Mohon jangan menutup halaman ini. Proses biasanya memakan waktu 1-2 menit.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Quick Support */}
      <div className="mt-4 text-center">
        <p className="text-xs text-text-secondary mb-2">Butuh bantuan?</p>
        <div className="flex justify-center space-x-4">
          <button className="flex items-center space-x-1 text-xs text-primary hover:underline">
            <Icon name="MessageCircle" size={12} />
            <span>Live Chat</span>
          </button>
          <button className="flex items-center space-x-1 text-xs text-primary hover:underline">
            <Icon name="Phone" size={12} />
            <span>Hubungi Kami</span>
          </button>
          <button className="flex items-center space-x-1 text-xs text-primary hover:underline">
            <Icon name="HelpCircle" size={12} />
            <span>FAQ</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutActions;