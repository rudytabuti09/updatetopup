import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import useSupabaseData from '../../hooks/useSupabaseData';
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
  const [searchParams] = useSearchParams();
  const { user, profile, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { allGames, paymentMethods, createTransaction } = useSupabaseData();
  
  // Function to update transaction status
  const updateTransaction = async (transactionId, updates) => {
    try {
      // This would typically call a Supabase function to update the transaction
      // For now, we'll just log it
      console.log('Updating transaction:', transactionId, updates);
      return { success: true };
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error };
    }
  };
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get order data from URL parameters or localStorage
  useEffect(() => {
    const loadOrderData = () => {
      try {
        // Try to get from URL parameters first
        const gameId = searchParams.get('gameId');
        const packageId = searchParams.get('packageId');
        const quantity = parseInt(searchParams.get('quantity')) || 1;

        if (gameId && packageId) {
          // Find game and package from Supabase data
          const game = allGames.find(g => g.id === gameId);
          if (game && game.packages) {
            const gamePackage = game.packages.find(p => p.id === packageId);
            if (gamePackage) {
              const subtotal = gamePackage.price * quantity;
              const adminFee = Math.max(2500, subtotal * 0.03); // 3% or min 2500
              const discountAmount = 0; // Can be calculated based on promo codes
              const total = subtotal + adminFee - discountAmount;

              setOrderData({
                game: {
                  id: game.id,
                  name: game.name,
                  logo: game.image || game.icon_url || 'https://via.placeholder.com/200'
                },
                package: {
                  id: gamePackage.id,
                  name: gamePackage.amount,
                  amount: gamePackage.amount,
                  currency: gamePackage.currency || 'Items',
                  price: gamePackage.price,
                  originalPrice: gamePackage.original_price || gamePackage.price,
                  discount: gamePackage.discount_percentage || 0
                },
                quantity,
                subtotal,
                adminFee,
                discount: discountAmount > 0 ? {
                  code: "PROMO",
                  amount: discountAmount
                } : null,
                total
              });
              setLoading(false);
              return;
            }
          }
        }

        // Fallback: try to get from localStorage
        const savedOrder = localStorage.getItem('wmx_checkout_order');
        if (savedOrder) {
          setOrderData(JSON.parse(savedOrder));
          setLoading(false);
          return;
        }

        // Final fallback: use sample data from first available game
        if (allGames.length > 0) {
          const sampleGame = allGames[0];
          const samplePackage = sampleGame.packages?.[0];
          
          if (samplePackage) {
            const subtotal = samplePackage.price;
            const adminFee = Math.max(2500, subtotal * 0.03);
            const total = subtotal + adminFee;

            setOrderData({
              game: {
                id: sampleGame.id,
                name: sampleGame.name,
                logo: sampleGame.image || 'https://via.placeholder.com/200'
              },
              package: {
                id: samplePackage.id,
                name: samplePackage.amount,
                amount: samplePackage.amount,
                currency: 'Items',
                price: samplePackage.price,
                originalPrice: samplePackage.price,
                discount: 0
              },
              quantity: 1,
              subtotal,
              adminFee,
              discount: null,
              total
            });
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading order data:', error);
        setLoading(false);
      }
    };

    if (allGames.length > 0) {
      loadOrderData();
    }
  }, [searchParams, allGames]);

  useEffect(() => {
    // Use real authentication data
    if (isAuthenticated && user && profile) {
      setUserAccount({
        name: profile.full_name || profile.username || 'User',
        email: user.email,
        phone: profile.phone_number || '',
        gameId: '', // User will need to fill this
        avatar: profile.avatar_url
      });
    } else {
      setUserAccount(null);
    }
  }, [isAuthenticated, user, profile]);

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
    if (!orderData || !selectedPaymentMethod) {
      showError('Silakan lengkapi semua data yang diperlukan.', 'Data Tidak Lengkap');
      return;
    }

    if (!userAccount?.gameId) {
      showError('Silakan masukkan User ID game Anda.', 'User ID Diperlukan');
      return;
    }

    setIsProcessing(true);
    
    try {
      // First, create transaction record in Supabase
      const transactionData = {
        game_id: orderData.game.id,
        package_id: orderData.package.id,
        user_game_id: userAccount.gameId,
        payment_method_id: selectedPaymentMethod.id,
        quantity: orderData.quantity,
        subtotal: orderData.subtotal,
        admin_fee: orderData.adminFee,
        discount_amount: orderData.discount?.amount || 0,
        total_amount: orderData.total,
        status: 'pending',
        customer_name: userAccount.name,
        customer_email: userAccount.email,
        customer_phone: userAccount.phone,
        notes: `Checkout via web - ${selectedPaymentMethod.name}`
      };

      const { data: transaction, error } = await createTransaction(transactionData);

      if (error) {
        throw new Error(error.message || 'Failed to create transaction');
      }

      // Now process with VIP Reseller API
      try {
        // Import VIP Reseller API
        const { vipResellerApi } = await import('../../services/vipResellerApi');
        
        // Map game name to service code (you'll need to get actual service codes from VIP Reseller)
        const getServiceCode = (gameName, packageName) => {
          // This is a simplified mapping - in production, you'd get this from VIP Reseller services API
          const serviceCodes = {
            'mobile-legends': {
              '86 Diamonds': 'ML86-S1',
              '172 Diamonds': 'ML172-S1',
              '257 Diamonds': 'ML257-S1',
              '344 Diamonds': 'ML344-S1'
            },
            'pubg-mobile': {
              '60 UC': 'PUBG60-S1',
              '325 UC': 'PUBG325-S1',
              '660 UC': 'PUBG660-S1'
            },
            'free-fire': {
              '70 Diamonds': 'FF70-S1',
              '140 Diamonds': 'FF140-S1',
              '355 Diamonds': 'FF355-S1'
            }
          };
          
          const gameKey = gameName.toLowerCase().replace(/[^a-z]/g, '-');
          return serviceCodes[gameKey]?.[packageName] || null;
        };

        const serviceCode = getServiceCode(orderData.game.name, orderData.package.amount);
        
        if (!serviceCode) {
          throw new Error('Service code not found for this game package');
        }

        // Process order with VIP Reseller
        const vipOrder = await vipResellerApi.createGameOrder(
          serviceCode,
          userAccount.gameId,
          userAccount.zoneId || null
        );

        if (vipOrder.result) {
          // Update transaction with VIP Reseller transaction ID
          await updateTransaction(transaction.id, {
            status: 'processing',
            external_transaction_id: vipOrder.data.trxid,
            notes: `VIP Reseller Order: ${vipOrder.data.trxid}`
          });

          // Show success notification
          showSuccess(
            `Pembayaran berhasil diproses! ${orderData.package.amount} akan segera masuk ke akun game Anda.`,
            'Pembayaran Berhasil! 🎉'
          );
          
          // Clear checkout data from localStorage
          localStorage.removeItem('wmx_checkout_order');
          
          // Show success modal with real transaction data
          setShowSuccessModal(true);
          
          // Auto redirect after 5 seconds
          setTimeout(() => {
            navigate('/dashboard');
          }, 5000);
        } else {
          throw new Error(vipOrder.message || 'VIP Reseller order failed');
        }
      } catch (vipError) {
        console.error('VIP Reseller API Error:', vipError);
        
        // Update transaction status to failed
        await updateTransaction(transaction.id, {
          status: 'failed',
          notes: `VIP Reseller Error: ${vipError.message}`
        });
        
        // For now, we'll still show success to user but log the error
        // In production, you might want to handle this differently
        showError(
          'Terjadi masalah dengan provider top-up. Tim kami akan menindaklanjuti pesanan Anda.',
          'Pesanan Tertunda'
        );
      }
      
    } catch (error) {
      console.error('Payment failed:', error);
      showError(
        error.message || 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi atau hubungi customer service.',
        'Pembayaran Gagal!'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigate('/game-selection-hub');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading checkout data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="ShoppingCart" size={32} className="text-text-secondary" />
            </div>
            <h3 className="text-xl font-gaming font-bold text-foreground mb-2">
              No Order Data
            </h3>
            <p className="text-text-secondary mb-6">
              Silakan pilih game dan package terlebih dahulu
            </p>
            <button
              onClick={() => navigate('/game-selection-hub')}
              className="bg-gradient-to-r from-primary to-secondary text-black px-6 py-3 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200"
            >
              Pilih Game
            </button>
          </div>
        </div>
      </div>
    )
  }

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