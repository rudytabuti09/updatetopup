import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PushNotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Mock notifications data
    const mockNotifications = [
      {
        id: 1,
        type: 'transaction',
        title: 'Top-up Berhasil!',
        message: 'Diamond Mobile Legends 275 telah ditambahkan ke akun Anda',
        timestamp: new Date(Date.now() - 300000),
        icon: 'CheckCircle',
        color: 'text-success',
        bgColor: 'bg-success/10',
        isRead: false
      },
      {
        id: 2,
        type: 'promotion',
        title: 'Promo Spesial Weekend!',
        message: 'Dapatkan bonus 20% untuk semua top-up Free Fire hari ini',
        timestamp: new Date(Date.now() - 1800000),
        icon: 'Gift',
        color: 'text-gaming-gold',
        bgColor: 'bg-gaming-gold/10',
        isRead: false
      },
      {
        id: 3,
        type: 'community',
        title: 'Event Tournament Dimulai',
        message: 'PUBG Mobile Championship 2025 telah dibuka! Daftar sekarang',
        timestamp: new Date(Date.now() - 3600000),
        icon: 'Trophy',
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        isRead: true
      },
      {
        id: 4,
        type: 'system',
        title: 'Maintenance Terjadwal',
        message: 'Sistem akan maintenance pada 20 Agustus 2025, 02:00 - 04:00 WIB',
        timestamp: new Date(Date.now() - 7200000),
        icon: 'Settings',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        isRead: true
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Show test notification
        new Notification('WMX TOPUP', {
          body: 'Notifikasi berhasil diaktifkan! Anda akan mendapat update terbaru.',
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev?.map(notif => 
        notif?.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev?.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} menit yang lalu`;
    } else if (hours < 24) {
      return `${hours} jam yang lalu`;
    } else {
      return timestamp?.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Icon name="Bell" size={20} className="text-primary" />
              {unreadCount > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Notifikasi
              </h3>
              <p className="text-xs text-text-secondary">
                {unreadCount} belum dibaca
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-primary hover:bg-primary/10"
              >
                <Icon name="CheckCheck" size={16} className="mr-1" />
                Baca Semua
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8"
            >
              <Icon 
                name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                size={16} 
                className="text-text-secondary"
              />
            </Button>
          </div>
        </div>

        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <div className="mt-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning font-medium">
                  Aktifkan notifikasi untuk update terbaru
                </span>
              </div>
              <Button 
                size="xs" 
                onClick={requestNotificationPermission}
                className="bg-warning text-black hover:bg-warning/90"
              >
                Aktifkan
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Notifications List */}
      <div className={`transition-all duration-300 ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-32 opacity-100'
      } overflow-y-auto`}>
        {notifications?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="BellOff" size={48} className="text-text-secondary mx-auto mb-3" />
            <p className="text-text-secondary">Belum ada notifikasi</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications?.slice(0, isExpanded ? notifications?.length : 2)?.map((notification) => (
              <div
                key={notification?.id}
                className={`p-4 hover:bg-surface/50 transition-colors cursor-pointer ${
                  !notification?.isRead ? 'bg-primary/5' : ''
                }`}
                onClick={() => markAsRead(notification?.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification?.bgColor}`}>
                    <Icon 
                      name={notification?.icon} 
                      size={18} 
                      className={notification?.color}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-semibold ${
                        !notification?.isRead ? 'text-foreground' : 'text-text-secondary'
                      }`}>
                        {notification?.title}
                      </h4>
                      {!notification?.isRead && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                      {notification?.message}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {formatTimeAgo(notification?.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer */}
      {notifications?.length > 2 && !isExpanded && (
        <div className="p-3 border-t border-border text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsExpanded(true)}
            className="text-primary hover:bg-primary/10"
          >
            Lihat {notifications?.length - 2} notifikasi lainnya
            <Icon name="ChevronDown" size={16} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PushNotificationCenter;