import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    { name: 'Home', path: '/homepage-gaming-commerce-hub', icon: 'Home' },
    { name: 'Games', path: '/game-selection-hub', icon: 'Gamepad2' },
    { name: 'Checkout', path: '/streamlined-checkout-flow', icon: 'ShoppingCart' },
    { name: 'Dashboard', path: '/personal-gaming-dashboard', icon: 'BarChart3' },
    { name: 'Community', path: '/gaming-community-portal', icon: 'Users' }
  ];

  const moreItems = [
    { name: 'Mobile', path: '/mobile-gaming-experience', icon: 'Smartphone' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-gaming' 
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link 
            to="/homepage-gaming-commerce-hub" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-neon-blue">
                <Icon name="Zap" size={24} className="text-black" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gaming-gold rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-gaming font-bold text-gaming-gradient">
                WMX TOPUP
              </span>
              <span className="text-xs text-text-secondary font-accent">
                Gaming Commerce Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActivePath(item?.path)
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon-blue'
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.name}</span>
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200">
                <Icon name="MoreHorizontal" size={18} />
                <span className="font-medium">More</span>
                <Icon name="ChevronDown" size={16} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-gaming-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {moreItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    className={`flex items-center space-x-3 px-4 py-3 hover:bg-primary/5 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                      isActivePath(item?.path) ? 'text-primary bg-primary/10' : 'text-foreground'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
              <Icon name="User" size={16} className="mr-2" />
              Login
            </Button>
            <Button variant="default" size="sm" className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow">
              <Icon name="CreditCard" size={16} className="mr-2" />
              Top Up Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Icon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              size={24} 
              className="text-foreground"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-card/95 backdrop-blur-md border-t border-border">
            <nav className="px-6 py-4 space-y-2">
              {[...navigationItems, ...moreItems]?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-foreground hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span className="font-medium">{item?.name}</span>
                </Link>
              ))}
            </nav>
            
            {/* Mobile CTA */}
            <div className="px-6 py-4 border-t border-border space-y-3">
              <Button 
                variant="outline" 
                fullWidth 
                className="border-primary/30 text-primary hover:bg-primary/10"
                onClick={closeMobileMenu}
              >
                <Icon name="User" size={18} className="mr-2" />
                Login to Account
              </Button>
              <Button 
                variant="default" 
                fullWidth 
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-neon-glow"
                onClick={closeMobileMenu}
              >
                <Icon name="CreditCard" size={18} className="mr-2" />
                Start Top Up
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;