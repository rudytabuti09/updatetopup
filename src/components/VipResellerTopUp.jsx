import React, { useState, useEffect } from 'react';
import { useVipResellerApi } from '../hooks/useVipResellerApi';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Icon from './AppIcon';
import Button from './ui/Button';

const VipResellerTopUp = ({ game, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotification();
  const {
    loading,
    services,
    getServices,
    getServiceStock,
    getGameNickname,
    createGameOrder,
    checkOrderStatus
  } = useVipResellerApi();

  const [step, setStep] = useState(1); // 1: Account, 2: Package, 3: Payment, 4: Processing
  const [formData, setFormData] = useState({
    userId: '',
    zoneId: '',
    nickname: '',
    selectedService: null,
    serviceStock: null
  });
  const [gameServices, setGameServices] = useState([]);
  const [validatingAccount, setValidatingAccount] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // Load services for the selected game
  useEffect(() => {
    const loadGameServices = async () => {
      if (game?.name) {
        try {
          const response = await getServices('game', game.name.toLowerCase());
          const availableServices = response.filter(service => service.status === 'available');
          setGameServices(availableServices);
        } catch (error) {
          showError('Gagal memuat layanan game', 'Error');
        }
      }
    };

    loadGameServices();
  }, [game]);

  // Validate user account
  const validateAccount = async () => {
    if (!formData.userId) {
      showError('Silakan masukkan User ID', 'Validasi Error');
      return;
    }

    // Check if game requires zone ID
    const requiresZone = ['mobile legends', 'genshin impact'].some(g => 
      game?.name?.toLowerCase().includes(g)
    );

    if (requiresZone && !formData.zoneId) {
      showError('Silakan masukkan Zone ID', 'Validasi Error');
      return;
    }

    setValidatingAccount(true);
    try {
      // Get game code for nickname validation
      let gameCode = 'mobilelegends'; // default
      if (game?.name?.toLowerCase().includes('pubg')) gameCode = 'pubgmobile';
      else if (game?.name?.toLowerCase().includes('free fire')) gameCode = 'freefire';
      else if (game?.name?.toLowerCase().includes('genshin')) gameCode = 'genshinimpact';

      const response = await getGameNickname(
        gameCode,
        formData.userId,
        formData.zoneId || null
      );

      if (response) {
        setFormData(prev => ({ ...prev, nickname: response }));
        showSuccess(`Akun ditemukan: ${response}`, 'Validasi Berhasil');
        setStep(2);
      } else {
        showError('Akun tidak ditemukan. Periksa kembali User ID dan Zone ID.', 'Akun Tidak Valid');
      }
    } catch (error) {
      showError('Gagal memvalidasi akun. Periksa kembali data Anda.', 'Validasi Gagal');
    } finally {
      setValidatingAccount(false);
    }
  };

  // Select service package
  const selectService = async (service) => {
    try {
      // Check stock
      const stock = await getServiceStock(service.code);
      if (stock && stock.stock > 0) {
        setFormData(prev => ({
          ...prev,
          selectedService: service,
          serviceStock: stock
        }));
        setStep(3);
      } else {
        showError('Stok tidak tersedia untuk paket ini', 'Stok Habis');
      }
    } catch (error) {
      showError('Gagal memeriksa stok paket', 'Error');
    }
  };

  // Process order
  const processOrder = async () => {
    if (!formData.selectedService) {
      showError('Silakan pilih paket terlebih dahulu', 'Error');
      return;
    }

    setProcessingOrder(true);
    setStep(4);

    try {
      const response = await createGameOrder(
        formData.selectedService.code,
        formData.userId,
        formData.zoneId || null
      );

      if (response) {
        setOrderResult(response);
        showSuccess(
          `Pesanan berhasil dibuat! Transaction ID: ${response.trxid}`,
          'Pesanan Berhasil'
        );
        
        // Start polling order status
        pollOrderStatus(response.trxid);
      }
    } catch (error) {
      showError('Gagal memproses pesanan', 'Pesanan Gagal');
      setStep(3); // Back to payment step
    } finally {
      setProcessingOrder(false);
    }
  };

  // Poll order status
  const pollOrderStatus = async (trxId) => {
    const maxAttempts = 10;
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await checkOrderStatus(trxId);
        if (status && status.length > 0) {
          const order = status[0];
          setOrderResult(order);

          if (order.status === 'success') {
            showSuccess('Top-up berhasil! Item telah masuk ke akun Anda.', 'Top-up Berhasil');
            if (onSuccess) onSuccess(order);
            return;
          } else if (order.status === 'error') {
            showError(`Top-up gagal: ${order.note}`, 'Top-up Gagal');
            return;
          }
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          showInfo('Pesanan masih diproses. Anda akan mendapat notifikasi saat selesai.', 'Pesanan Diproses');
        }
      } catch (error) {
        console.error('Error polling status:', error);
      }
    };

    poll();
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Get price for service (use premium if available, otherwise basic)
  const getServicePrice = (service) => {
    if (service.price) {
      return service.price.premium || service.price.basic || 0;
    }
    return 0;
  };

  return (
    <div className="max-w-2xl mx-auto bg-card rounded-xl p-6 border border-border shadow-gaming">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <img 
            src={game?.image || 'https://via.placeholder.com/48'} 
            alt={game?.name}
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-gaming font-bold text-foreground">
              Top Up {game?.name}
            </h2>
            <p className="text-text-secondary text-sm">
              Powered by VIP Reseller API
            </p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
        >
          <Icon name="X" size={20} className="text-text-secondary" />
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { step: 1, label: 'Akun', icon: 'User' },
          { step: 2, label: 'Paket', icon: 'Package' },
          { step: 3, label: 'Bayar', icon: 'CreditCard' },
          { step: 4, label: 'Selesai', icon: 'CheckCircle' }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              step >= item.step 
                ? 'bg-primary text-black' 
                : 'bg-surface text-text-secondary'
            }`}>
              <Icon name={item.icon} size={16} />
            </div>
            <span className={`ml-2 text-sm ${
              step >= item.step ? 'text-foreground' : 'text-text-secondary'
            }`}>
              {item.label}
            </span>
            {index < 3 && (
              <div className={`w-8 h-0.5 mx-4 ${
                step > item.step ? 'bg-primary' : 'bg-surface'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Account Validation */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              User ID *
            </label>
            <input
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="Masukkan User ID"
              className="w-full p-3 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Zone ID for games that require it */}
          {['mobile legends', 'genshin impact'].some(g => 
            game?.name?.toLowerCase().includes(g)
          ) && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Zone ID *
              </label>
              <input
                type="text"
                value={formData.zoneId}
                onChange={(e) => setFormData(prev => ({ ...prev, zoneId: e.target.value }))}
                placeholder="Masukkan Zone ID"
                className="w-full p-3 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
              />
            </div>
          )}

          <Button
            onClick={validateAccount}
            disabled={validatingAccount || !formData.userId}
            className="w-full"
            loading={validatingAccount}
          >
            {validatingAccount ? 'Memvalidasi...' : 'Validasi Akun'}
          </Button>
        </div>
      )}

      {/* Step 2: Package Selection */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="p-4 bg-success/10 rounded-lg border border-success/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-success font-medium">Akun Tervalidasi</span>
            </div>
            <p className="text-success/80 text-sm">
              Nickname: {formData.nickname}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-gaming font-bold text-foreground mb-4">
              Pilih Paket
            </h3>
            <div className="grid gap-3">
              {gameServices.map((service) => (
                <div
                  key={service.code}
                  onClick={() => selectService(service)}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-all hover:bg-surface/30"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {service.name}
                      </h4>
                      <p className="text-text-secondary text-sm">
                        {service.game}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-gaming font-bold text-primary">
                        {formatPrice(getServicePrice(service))}
                      </div>
                      <div className="text-xs text-success">
                        {service.status === 'available' ? 'Tersedia' : 'Stok Habis'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setStep(1)}
            variant="outline"
            className="w-full"
          >
            Kembali
          </Button>
        </div>
      )}

      {/* Step 3: Payment Confirmation */}
      {step === 3 && formData.selectedService && (
        <div className="space-y-6">
          <div className="p-4 bg-surface/30 rounded-lg">
            <h3 className="font-gaming font-bold text-foreground mb-3">
              Ringkasan Pesanan
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Akun:</span>
                <span className="text-foreground">{formData.nickname}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Paket:</span>
                <span className="text-foreground">{formData.selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Harga:</span>
                <span className="text-primary font-gaming font-bold">
                  {formatPrice(getServicePrice(formData.selectedService))}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setStep(2)}
              variant="outline"
              className="flex-1"
            >
              Kembali
            </Button>
            <Button
              onClick={processOrder}
              disabled={processingOrder}
              className="flex-1"
              loading={processingOrder}
            >
              Proses Pesanan
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Processing/Result */}
      {step === 4 && (
        <div className="space-y-6 text-center">
          {!orderResult ? (
            <div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                Memproses Pesanan...
              </h3>
              <p className="text-text-secondary">
                Mohon tunggu, pesanan Anda sedang diproses
              </p>
            </div>
          ) : (
            <div>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                orderResult.status === 'success' ? 'bg-success/20' :
                orderResult.status === 'error' ? 'bg-error/20' :
                'bg-warning/20'
              }`}>
                <Icon 
                  name={
                    orderResult.status === 'success' ? 'CheckCircle' :
                    orderResult.status === 'error' ? 'XCircle' :
                    'Clock'
                  } 
                  size={32} 
                  className={
                    orderResult.status === 'success' ? 'text-success' :
                    orderResult.status === 'error' ? 'text-error' :
                    'text-warning'
                  }
                />
              </div>
              
              <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                {orderResult.status === 'success' ? 'Pesanan Berhasil!' :
                 orderResult.status === 'error' ? 'Pesanan Gagal' :
                 'Pesanan Diproses'}
              </h3>
              
              <p className="text-text-secondary mb-4">
                Transaction ID: {orderResult.trxid}
              </p>
              
              {orderResult.note && (
                <p className="text-text-secondary text-sm mb-4">
                  {orderResult.note}
                </p>
              )}

              <Button
                onClick={() => {
                  if (onSuccess && orderResult.status === 'success') {
                    onSuccess(orderResult);
                  } else if (onCancel) {
                    onCancel();
                  }
                }}
                className="w-full"
              >
                Selesai
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VipResellerTopUp;