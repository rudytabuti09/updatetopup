import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCards = ({ stats, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statsData = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Total platform revenue'
    },
    {
      title: 'Today Revenue',
      value: formatCurrency(stats.todayRevenue),
      change: '+8.2%',
      changeType: 'positive',
      icon: 'TrendingUp',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Revenue today'
    },
    {
      title: 'Total Transactions',
      value: formatNumber(stats.totalTransactions),
      change: '+15.3%',
      changeType: 'positive',
      icon: 'CreditCard',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: 'All time transactions'
    },
    {
      title: 'Today Transactions',
      value: stats.todayTransactions.toString(),
      change: '+22.1%',
      changeType: 'positive',
      icon: 'Activity',
      color: 'text-gaming-gold',
      bgColor: 'bg-gaming-gold/10',
      description: 'Transactions today'
    },
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      change: '+5.7%',
      changeType: 'positive',
      icon: 'Users',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      description: 'Registered users'
    },
    {
      title: 'Active Games',
      value: stats.totalGames.toString(),
      change: '+2',
      changeType: 'positive',
      icon: 'Gamepad2',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      description: 'Available games'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+0.3%',
      changeType: 'positive',
      icon: 'CheckCircle',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Transaction success rate'
    },
    {
      title: 'VIP Balance',
      value: formatCurrency(stats.vipBalance),
      change: '-2.1%',
      changeType: 'negative',
      icon: 'Wallet',
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      description: 'VIP Reseller balance'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-card rounded-xl p-6 border border-border shadow-gaming hover:shadow-gaming-lg transition-all duration-200">
          {loading ? (
            // Loading skeleton
            <div className="animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-surface/50 rounded-xl"></div>
                <div className="w-16 h-4 bg-surface/50 rounded"></div>
              </div>
              <div className="w-24 h-8 bg-surface/50 rounded mb-2"></div>
              <div className="w-32 h-3 bg-surface/50 rounded"></div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon name={stat.icon} size={24} className={stat.color} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  <Icon 
                    name={stat.changeType === 'positive' ? 'TrendingUp' : 'TrendingDown'} 
                    size={12} 
                  />
                  {stat.change}
                </div>
              </div>

              {/* Value */}
              <div className="mb-2">
                <div className="text-2xl font-gaming font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-foreground">
                  {stat.title}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-text-secondary">
                {stat.description}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;