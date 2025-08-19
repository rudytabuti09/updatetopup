import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import OrderSummary from './components/OrderSummary';
import PaymentMethods from './components/PaymentMethods';
import SecuritySection from './components/SecuritySection';
import UserAccountSection from './components/UserAccountSection';
import ProgressIndicator from './components/ProgressIndicator';
import TrustElements from './components/TrustElements';
import CheckoutActions from './components/CheckoutActions';

const StreamlinedCheckoutFlow = () => {
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Mock order data
  const orderData = {
    game: {
      name: "Mobile Legends: Bang Bang",
      logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop"
    },
    package: {
      name: "Weekly Diamond Pass",
      amount: "878",
      currency: "Diamonds",
      price: 85000,
      originalPrice: 100000,
      discount: 15
    },
    quantity: 1,
    subtotal: 85000,
    adminFee: 2500,
    discount: {
      code: "NEWUSER15",
      amount: 12750
    },
    total: 74750
  };

  // Mock user account (set to null for guest checkout demo)
  const mockUserAccount = {
    name: "Ahmad Pratama",
    email: "ahmad.pratama@email.com",
    phone: "+62 812-3456-7890",
    gameId: "AhmadPro123"
  };

  useEffect(() => {
    // Simulate checking user login status
    const checkUserStatus = () => {
      // For demo purposes, randomly show logged in or guest
      const isLoggedIn = Math.random() > 0.5;
      if (isLoggedIn) {
        setUserAccount(mockUserAccount);
      }
    };

    checkUserStatus();
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAccountUpdate = (accountData) => {
    setUserAccount(prev => ({
      ...prev,
      ...accountData
    }));
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show success modal
      setShowSuccessModal(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate('/personal-gaming-dashboard');
      }, 3000);
      
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/game-selection-hub');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-gaming font-bold text-gaming-gradient mb-4">
              Checkout Aman & Cepat
            </h1>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Selesaikan pembelian Anda dengan sistem pembayaran teraman dan terpercaya di Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Indicator */}
              <ProgressIndicator currentStep={2} totalSteps={4} />

              {/* Order Summary */}
              <OrderSummary orderData={orderData} />

              {/* User Account Section */}
              <UserAccountSection 
                userAccount={userAccount}
                onAccountUpdate={handleAccountUpdate}
              />

              {/* Payment Methods */}
              <PaymentMethods 
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={handlePaymentMethodSelect}
              />

              {/* Security Section */}
              <SecuritySection />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Trust Elements */}
              <TrustElements />

              {/* Checkout Actions */}
              <CheckoutActions 
                orderData={orderData}
                selectedPaymentMethod={selectedPaymentMethod}
                isProcessing={isProcessing}
                onProcessPayment={handleProcessPayment}
                onBack={handleBack}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="gaming-card p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircle" size={48} className="text-success" />
            </div>
            
            <h2 className="text-2xl font-gaming font-bold text-success mb-4">
              Pembayaran Berhasil!
            </h2>
            
            <p className="text-text-secondary mb-6">
              Transaksi Anda telah berhasil diproses. Diamond akan segera masuk ke akun game Anda.
            </p>
            
            <div className="space-y-3">
              <div className="p-4 bg-surface/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-text-secondary">Transaction ID</span>
                  <span className="text-sm font-mono text-foreground">WMX-{Date.now()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">Estimasi Pengiriman</span>
                  <span className="text-sm font-medium text-primary">1-5 menit</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
                <Icon name="Clock" size={16} />
                <span>Mengarahkan ke dashboard dalam 3 detik...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedCheckoutFlow;