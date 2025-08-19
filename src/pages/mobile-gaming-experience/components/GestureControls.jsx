import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GestureControls = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showGestureGuide, setShowGestureGuide] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const gestureGuides = [
    {
      icon: 'ArrowDown',
      title: 'Tarik ke Bawah',
      description: 'Refresh halaman dan data terbaru',
      demo: 'pull-down'
    },
    {
      icon: 'ArrowUp',
      title: 'Tarik ke Atas',
      description: 'Muat lebih banyak konten',
      demo: 'pull-up'
    },
    {
      icon: 'ArrowLeft',
      title: 'Geser ke Kiri',
      description: 'Navigasi ke halaman berikutnya',
      demo: 'swipe-left'
    },
    {
      icon: 'ArrowRight',
      title: 'Geser ke Kanan',
      description: 'Kembali ke halaman sebelumnya',
      demo: 'swipe-right'
    },
    {
      icon: 'Hand',
      title: 'Tap & Hold',
      description: 'Akses menu konteks cepat',
      demo: 'long-press'
    },
    {
      icon: 'Zap',
      title: 'Double Tap',
      description: 'Quick action atau zoom',
      demo: 'double-tap'
    }
  ];

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    let isScrolling = false;
    let startTime = 0;

    const handleTouchStart = (e) => {
      startY.current = e?.touches?.[0]?.clientY;
      startTime = Date.now();
      isScrolling = false;
    };

    const handleTouchMove = (e) => {
      if (!startY?.current) return;
      
      currentY.current = e?.touches?.[0]?.clientY;
      const diff = currentY?.current - startY?.current;
      
      // Only trigger pull-to-refresh if at top of page and pulling down
      if (window.scrollY === 0 && diff > 0 && diff < 150) {
        e?.preventDefault();
        setPullDistance(diff);
        isScrolling = true;
        
        // Haptic feedback
        if (navigator.vibrate && diff > 50 && diff < 55) {
          navigator.vibrate(25);
        }
      }
    };

    const handleTouchEnd = (e) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (pullDistance > 80) {
        triggerRefresh();
      }
      
      setPullDistance(0);
      startY.current = 0;
      currentY.current = 0;
      isScrolling = false;
    };

    container?.addEventListener('touchstart', handleTouchStart, { passive: false });
    container?.addEventListener('touchmove', handleTouchMove, { passive: false });
    container?.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container?.removeEventListener('touchstart', handleTouchStart);
      container?.removeEventListener('touchmove', handleTouchMove);
      container?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance]);

  const triggerRefresh = async () => {
    setIsRefreshing(true);
    
    // Haptic feedback for successful refresh
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50]);
    }
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const formatLastUpdate = (date) => {
    return date?.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const refreshThreshold = 80;
  const refreshProgress = Math.min((pullDistance / refreshThreshold) * 100, 100);

  return (
    <div ref={containerRef} className="bg-card rounded-2xl shadow-gaming border border-border overflow-hidden">
      {/* Pull-to-Refresh Indicator */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          pullDistance > 0 ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-primary/10 border-b border-primary/20">
          <div className="flex items-center justify-center space-x-3">
            <div className={`transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            } ${pullDistance > refreshThreshold ? 'rotate-180' : ''}`}>
              <Icon 
                name={isRefreshing ? "Loader2" : "ArrowDown"} 
                size={20} 
                className="text-primary"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-primary">
                {isRefreshing 
                  ? 'Memperbarui...' 
                  : pullDistance > refreshThreshold 
                    ? 'Lepas untuk refresh' :'Tarik untuk refresh'
                }
              </p>
              <div className="w-32 h-1 bg-primary/20 rounded-full mt-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-100"
                  style={{ width: `${refreshProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Hand" size={20} className="text-black" />
            </div>
            <div>
              <h3 className="text-lg font-gaming font-bold text-foreground">
                Gesture Controls
              </h3>
              <p className="text-xs text-text-secondary">
                Update terakhir: {formatLastUpdate(lastUpdate)}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGestureGuide(!showGestureGuide)}
            className="w-8 h-8"
          >
            <Icon 
              name={showGestureGuide ? "ChevronUp" : "Info"} 
              size={16} 
              className="text-text-secondary"
            />
          </Button>
        </div>
      </div>
      {/* Gesture Guide */}
      <div className={`transition-all duration-300 ${
        showGestureGuide ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <div className="p-4 bg-surface/50">
          <h4 className="font-semibold text-foreground mb-3">
            Panduan Gesture
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {gestureGuides?.map((guide, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={guide?.icon} size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-foreground text-sm">
                    {guide?.title}
                  </h5>
                  <p className="text-xs text-text-secondary">
                    {guide?.description}
                  </p>
                </div>
                <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-4">
        <h4 className="font-semibold text-foreground mb-3">
          Quick Actions
        </h4>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 h-auto py-3"
            onClick={triggerRefresh}
            disabled={isRefreshing}
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon 
                name={isRefreshing ? "Loader2" : "RefreshCw"} 
                size={18} 
                className={isRefreshing ? "animate-spin" : ""}
              />
              <span className="text-xs">
                {isRefreshing ? 'Refreshing...' : 'Manual Refresh'}
              </span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="border-secondary/30 text-secondary hover:bg-secondary/10 h-auto py-3"
          >
            <div className="flex flex-col items-center space-y-1">
              <Icon name="Settings" size={18} />
              <span className="text-xs">Gesture Settings</span>
            </div>
          </Button>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-text-secondary">Gesture aktif</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Smartphone" size={14} className="text-text-secondary" />
            <span className="text-text-secondary">Touch optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureControls;