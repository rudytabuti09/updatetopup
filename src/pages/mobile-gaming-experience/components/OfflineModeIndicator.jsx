import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OfflineModeIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queuedTransactions, setQueuedTransactions] = useState([]);
  const [showOfflineFeatures, setShowOfflineFeatures] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Process queued transactions when back online
      if (queuedTransactions?.length > 0) {
        processQueuedTransactions();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mock queued transactions for demo
    if (!isOnline) {
      setQueuedTransactions([
        {
          id: 1,
          game: 'Mobile Legends',
          package: 'Diamond 275',
          amount: 'Rp 75.000',
          timestamp: new Date()
        },
        {
          id: 2,
          game: 'Free Fire',
          package: 'Diamond 720',
          amount: 'Rp 95.000',
          timestamp: new Date()
        }
      ]);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [queuedTransactions?.length]);

  const processQueuedTransactions = () => {
    // Simulate processing queued transactions
    setTimeout(() => {
      setQueuedTransactions([]);
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('WMX TOPUP - Transaksi Berhasil', {
          body: `${queuedTransactions.length} transaksi yang tertunda telah diproses`,
          icon: '/favicon.ico'
        });
      }
    }, 2000);
  };

  const offlineFeatures = [
    {
      icon: 'Database',
      title: 'Riwayat Transaksi',
      description: 'Lihat transaksi sebelumnya yang tersimpan',
      available: true
    },
    {
      icon: 'Gamepad2',
      title: 'Info Game Tersimpan',
      description: 'Akses informasi game yang di-cache',
      available: true
    },
    {
      icon: 'ShoppingCart',
      title: 'Antrian Pembelian',
      description: 'Transaksi akan diproses saat online',
      available: true
    },
    {
      icon: 'Users',
      title: 'Profil & Pengaturan',
      description: 'Kelola akun dan preferensi',
      available: true
    }
  ];

  if (isOnline && queuedTransactions?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
      {/* Connection Status */}
      <div className={`p-4 ${
        isOnline 
          ? 'bg-success/10 border-b border-success/20' :'bg-warning/10 border-b border-warning/20'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isOnline ? 'bg-success/20' : 'bg-warning/20'
          }`}>
            <Icon 
              name={isOnline ? "Wifi" : "WifiOff"} 
              size={20} 
              className={isOnline ? 'text-success' : 'text-warning'}
            />
          </div>
          <div className="flex-1">
            <h3 className={`font-gaming font-bold ${
              isOnline ? 'text-success' : 'text-warning'
            }`}>
              {isOnline ? 'Terhubung ke Internet' : 'Mode Offline'}
            </h3>
            <p className="text-sm text-text-secondary">
              {isOnline 
                ? 'Semua fitur tersedia' :'Beberapa fitur terbatas saat offline'
              }
            </p>
          </div>
          {!isOnline && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOfflineFeatures(!showOfflineFeatures)}
              className="w-8 h-8"
            >
              <Icon 
                name={showOfflineFeatures ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-text-secondary"
              />
            </Button>
          )}
        </div>
      </div>
      {/* Queued Transactions */}
      {queuedTransactions?.length > 0 && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-foreground">
              Transaksi Tertunda ({queuedTransactions?.length})
            </h4>
            <Icon name="Clock" size={16} className="text-warning" />
          </div>
          
          <div className="space-y-2">
            {queuedTransactions?.map((transaction) => (
              <div 
                key={transaction?.id}
                className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <Icon name="Gamepad2" size={16} className="text-warning" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction?.game}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {transaction?.package}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">
                    {transaction?.amount}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Menunggu...
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <p className="text-sm text-primary">
                Transaksi akan otomatis diproses saat terhubung internet
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Offline Features */}
      {!isOnline && showOfflineFeatures && (
        <div className="p-4">
          <h4 className="font-semibold text-foreground mb-3">
            Fitur Tersedia Offline
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {offlineFeatures?.map((feature, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  feature?.available
                    ? 'bg-success/5 border-success/20 hover:bg-success/10' :'bg-surface border-border opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  feature?.available ? 'bg-success/20' : 'bg-surface'
                }`}>
                  <Icon 
                    name={feature?.icon} 
                    size={16} 
                    className={feature?.available ? 'text-success' : 'text-text-secondary'}
                  />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${
                    feature?.available ? 'text-foreground' : 'text-text-secondary'
                  }`}>
                    {feature?.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {feature?.description}
                  </p>
                </div>
                {feature?.available && (
                  <Icon name="Check" size={16} className="text-success" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Retry Connection */}
      {!isOnline && (
        <div className="p-4 border-t border-border">
          <Button 
            variant="outline" 
            fullWidth 
            className="border-primary/30 text-primary hover:bg-primary/10"
            onClick={() => window.location?.reload()}
          >
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Coba Sambung Ulang
          </Button>
        </div>
      )}
    </div>
  );
};

export default OfflineModeIndicator;