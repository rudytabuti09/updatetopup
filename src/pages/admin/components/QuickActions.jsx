import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const quickActions = [
    {
      title: 'Add New Game',
      description: 'Add a new game to the platform',
      icon: 'Plus',
      color: 'text-green-500 bg-green-500/10',
      href: '/admin/games/add'
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: 'Users',
      color: 'text-blue-500 bg-blue-500/10',
      href: '/admin/users'
    },
    {
      title: 'Service Mapping',
      description: 'Map VIP Reseller services',
      icon: 'GitBranch',
      color: 'text-purple-500 bg-purple-500/10',
      href: '/admin/services'
    },
    {
      title: 'Revenue Report',
      description: 'Generate revenue reports',
      icon: 'TrendingUp',
      color: 'text-orange-500 bg-orange-500/10',
      href: '/admin/reports'
    },
    {
      title: 'System Settings',
      description: 'Configure system settings',
      icon: 'Settings',
      color: 'text-gray-500 bg-gray-500/10',
      href: '/admin/settings'
    },
    {
      title: 'VIP Balance Check',
      description: 'Check VIP Reseller balance',
      icon: 'Wallet',
      color: 'text-yellow-500 bg-yellow-500/10',
      href: '/admin/vip-balance'
    }
  ];

  return (
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-primary hover:bg-primary/90 text-black font-gaming font-bold"
      >
        <Icon name="Zap" size={16} className="mr-2" />
        Quick Actions
        <Icon name="ChevronDown" size={16} className="ml-2" />
      </Button>

      {showDropdown && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-gaming-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-gaming font-bold text-foreground">Quick Actions</h3>
              <p className="text-sm text-text-secondary">Perform common admin tasks</p>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-4 p-4 hover:bg-surface/20 transition-colors border-b border-border/50 last:border-b-0"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                    <Icon name={action.icon} size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{action.title}</div>
                    <div className="text-sm text-text-secondary">{action.description}</div>
                  </div>
                  <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                </Link>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-surface/10">
              <Link
                to="/admin/help"
                onClick={() => setShowDropdown(false)}
                className="flex items-center justify-center gap-2 text-sm text-text-secondary hover:text-foreground transition-colors"
              >
                <Icon name="HelpCircle" size={16} />
                Need help? View documentation
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuickActions;