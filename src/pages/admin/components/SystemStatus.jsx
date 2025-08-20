import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SystemStatus = ({ health, stats, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'checking':
        return 'text-blue-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'checking':
        return 'Clock';
      default:
        return 'HelpCircle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Healthy';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const systemComponents = [
    {
      name: 'Supabase Database',
      status: health?.supabase || 'checking',
      description: 'User data & transactions',
      icon: 'Database'
    },
    {
      name: 'VIP Reseller API',
      status: health?.vipReseller || 'checking',
      description: 'Game top-up service',
      icon: 'Zap'
    },
    {
      name: 'Server Status',
      status: health?.server || 'healthy',
      description: 'Application server',
      icon: 'Server'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Monitor" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-gaming font-bold text-foreground">
              System Status
            </h3>
            <p className="text-sm text-text-secondary">
              Real-time system monitoring
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
          title="Refresh Status"
        >
          <Icon 
            name="RefreshCw" 
            size={16} 
            className={`text-text-secondary ${refreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>

      {/* System Components */}
      <div className="space-y-4 mb-6">
        {systemComponents.map((component, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-surface/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-surface/50 rounded-lg flex items-center justify-center">
                <Icon name={component.icon} size={16} className="text-text-secondary" />
              </div>
              <div>
                <div className="font-medium text-foreground">{component.name}</div>
                <div className="text-xs text-text-secondary">{component.description}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon 
                name={getStatusIcon(component.status)} 
                size={16} 
                className={getStatusColor(component.status)} 
              />
              <span className={`text-sm font-medium ${getStatusColor(component.status)}`}>
                {getStatusText(component.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-green-500" />
            <span className="text-sm font-medium text-foreground">Success Rate</span>
          </div>
          <span className="text-sm font-bold text-green-500">
            {stats?.successRate || 0}%
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Icon name="Wallet" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">VIP Balance</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {formatCurrency(stats?.vipBalance)}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center gap-2">
            <Icon name="Activity" size={16} className="text-secondary" />
            <span className="text-sm font-medium text-foreground">Today Orders</span>
          </div>
          <span className="text-sm font-bold text-secondary">
            {stats?.todayTransactions || 0}
          </span>
        </div>
      </div>

      {/* System Health Indicator */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Overall Health</span>
          <div className="flex items-center gap-2">
            {Object.values(health || {}).every(status => status === 'healthy') ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-500">All Systems Operational</span>
              </>
            ) : Object.values(health || {}).some(status => status === 'error') ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-500">System Issues Detected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-500">Monitoring Systems</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;