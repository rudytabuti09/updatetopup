import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MobileHeader = ({ onMenuToggle, isMenuOpen }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const updateTime = () => {
      setCurrentTime(new Date());
    };

    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery?.level * 100));
        } catch (error) {
          setBatteryLevel(85); // Fallback
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    const timeInterval = setInterval(updateTime, 1000);
    getBatteryInfo();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-gaming' 
        : 'bg-transparent'
    }`}>
      {/* Status Bar */}
      <div className="bg-black/90 text-white text-xs px-4 py-1 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-medium">{formatTime(currentTime)}</span>
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary">WMX</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Icon name="Wifi" size={12} className="text-primary" />
            <Icon name="Signal" size={12} className="text-white" />
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs">{batteryLevel}%</span>
            <div className={`w-6 h-3 border border-white rounded-sm relative ${
              batteryLevel > 20 ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <div 
                className="h-full bg-current rounded-sm transition-all duration-300"
                style={{ width: `${batteryLevel}%` }}
              ></div>
              <div className="absolute -right-1 top-1 w-1 h-1 bg-white rounded-r"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-md">
        {/* Logo */}
        <Link 
          to="/homepage-gaming-commerce-hub" 
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon-blue">
              <Icon name="Zap" size={18} className="text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gaming-gold rounded-full animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-gaming font-bold text-gaming-gradient">
              WMX TOPUP
            </span>
            <span className="text-xs text-text-secondary font-accent -mt-1">
              Mobile Gaming Hub
            </span>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20"
          >
            <Icon name="Search" size={18} className="text-primary" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 relative"
          >
            <Icon name="Bell" size={18} className="text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">3</span>
            </div>
          </Button>

          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Icon 
              name={isMenuOpen ? "X" : "Menu"} 
              size={20} 
              className="text-foreground"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;