import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState(['dashboard']);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: 'LayoutDashboard',
      path: '/admin',
      exact: true
    },
    {
      id: 'games',
      title: 'Games Management',
      icon: 'Gamepad2',
      children: [
        { title: 'All Games', path: '/admin/games', icon: 'List' },
        { title: 'Add Game', path: '/admin/games/add', icon: 'Plus' },
        { title: 'Service Codes', path: '/admin/games/service-codes', icon: 'Code' },
        { title: 'VIP Reseller Sync', path: '/admin/games/vip-sync', icon: 'RefreshCw' }
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      icon: 'Users',
      children: [
        { title: 'All Users', path: '/admin/users', icon: 'List' },
        { title: 'User Roles', path: '/admin/users/roles', icon: 'Shield' },
        { title: 'Banned Users', path: '/admin/users/banned', icon: 'UserX' },
        { title: 'User Analytics', path: '/admin/users/analytics', icon: 'BarChart3' }
      ]
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'CreditCard',
      children: [
        { title: 'All Transactions', path: '/admin/transactions', icon: 'List' },
        { title: 'Pending Orders', path: '/admin/transactions/pending', icon: 'Clock' },
        { title: 'Failed Orders', path: '/admin/transactions/failed', icon: 'XCircle' },
        { title: 'Refunds', path: '/admin/transactions/refunds', icon: 'RotateCcw' }
      ]
    },
    {
      id: 'revenue',
      title: 'Revenue & Analytics',
      icon: 'TrendingUp',
      children: [
        { title: 'Revenue Dashboard', path: '/admin/revenue', icon: 'DollarSign' },
        { title: 'Sales Reports', path: '/admin/revenue/reports', icon: 'FileText' },
        { title: 'Game Performance', path: '/admin/revenue/games', icon: 'Target' },
        { title: 'Payment Methods', path: '/admin/revenue/payments', icon: 'CreditCard' }
      ]
    },
    {
      id: 'vip-reseller',
      title: 'VIP Reseller',
      icon: 'Zap',
      children: [
        { title: 'API Status', path: '/admin/vip-reseller/status', icon: 'Activity' },
        { title: 'Balance & Usage', path: '/admin/vip-reseller/balance', icon: 'Wallet' },
        { title: 'Service Mapping', path: '/admin/vip-reseller/mapping', icon: 'GitBranch' },
        { title: 'API Logs', path: '/admin/vip-reseller/logs', icon: 'FileText' }
      ]
    },
    {
      id: 'promotions',
      title: 'Promotions',
      icon: 'Gift',
      children: [
        { title: 'Active Promotions', path: '/admin/promotions', icon: 'List' },
        { title: 'Create Promotion', path: '/admin/promotions/add', icon: 'Plus' },
        { title: 'Discount Codes', path: '/admin/promotions/codes', icon: 'Tag' },
        { title: 'Campaign Analytics', path: '/admin/promotions/analytics', icon: 'BarChart3' }
      ]
    },
    {
      id: 'content',
      title: 'Content Management',
      icon: 'FileText',
      children: [
        { title: 'Pages', path: '/admin/content/pages', icon: 'File' },
        { title: 'Announcements', path: '/admin/content/announcements', icon: 'Megaphone' },
        { title: 'FAQ', path: '/admin/content/faq', icon: 'HelpCircle' },
        { title: 'Media Library', path: '/admin/content/media', icon: 'Image' }
      ]
    },
    {
      id: 'system',
      title: 'System Settings',
      icon: 'Settings',
      children: [
        { title: 'General Settings', path: '/admin/settings', icon: 'Settings' },
        { title: 'Payment Settings', path: '/admin/settings/payments', icon: 'CreditCard' },
        { title: 'Email Settings', path: '/admin/settings/email', icon: 'Mail' },
        { title: 'Security Settings', path: '/admin/settings/security', icon: 'Shield' }
      ]
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      icon: 'Monitor',
      children: [
        { title: 'System Health', path: '/admin/monitoring/health', icon: 'Heart' },
        { title: 'Error Logs', path: '/admin/monitoring/errors', icon: 'AlertTriangle' },
        { title: 'Performance', path: '/admin/monitoring/performance', icon: 'Zap' },
        { title: 'Backup Status', path: '/admin/monitoring/backup', icon: 'Database' }
      ]
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border overflow-y-auto">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.children ? (
                // Section with children
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      expandedSections.includes(item.id) || isActive(`/admin/${item.id}`)
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:text-foreground hover:bg-surface/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon name={item.icon} size={18} />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <Icon 
                      name="ChevronDown" 
                      size={16} 
                      className={`transition-transform duration-200 ${
                        expandedSections.includes(item.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSections.includes(item.id) && (
                    <div className="mt-2 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(child.path)
                              ? 'bg-primary text-black shadow-sm'
                              : 'text-text-secondary hover:text-foreground hover:bg-surface/50'
                          }`}
                        >
                          <Icon name={child.icon} size={16} />
                          <span className="text-sm">{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Single item
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.path, item.exact)
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-text-secondary hover:text-foreground hover:bg-surface/50'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
        <div className="text-center">
          <div className="text-xs text-text-secondary mb-2">WMX TOPUP Admin v1.0</div>
          <div className="flex items-center justify-center gap-4 text-xs text-text-secondary">
            <a href="#" className="hover:text-primary transition-colors">Help</a>
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;