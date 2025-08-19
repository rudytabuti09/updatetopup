import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BottomNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    { 
      name: 'Home', 
      path: '/homepage-gaming-commerce-hub', 
      icon: 'Home',
      activeIcon: 'Home'
    },
    { 
      name: 'Games', 
      path: '/game-selection-hub', 
      icon: 'Gamepad2',
      activeIcon: 'Gamepad2'
    },
    { 
      name: 'Mobile', 
      path: '/mobile-gaming-experience', 
      icon: 'Smartphone',
      activeIcon: 'Smartphone'
    },
    { 
      name: 'Dashboard', 
      path: '/personal-gaming-dashboard', 
      icon: 'BarChart3',
      activeIcon: 'BarChart3'
    },
    { 
      name: 'Community', 
      path: '/gaming-community-portal', 
      icon: 'Users',
      activeIcon: 'Users'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navigationItems?.map((item) => {
          const isActive = isActivePath(item?.path);
          
          return (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'bg-primary/10 text-primary' :'text-text-secondary hover:text-primary hover:bg-primary/5'
              }`}
            >
              <div className={`relative transition-transform duration-200 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <Icon 
                  name={isActive ? item?.activeIcon : item?.icon} 
                  size={22} 
                  className={isActive ? 'text-primary' : 'text-current'}
                />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 truncate max-w-full ${
                isActive ? 'text-primary font-semibold' : 'text-current'
              }`}>
                {item?.name}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-card/95"></div>
    </div>
  );
};

export default BottomNavigation;