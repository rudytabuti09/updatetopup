import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions = [], onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock recent transactions if none provided
  const mockTransactions = [
    {
      id: 'TRX001',
      user_id: 'user1',
      user: {
        full_name: 'Ahmad Rizki',
        email: 'ahmad.rizki@email.com',
        avatar_url: null
      },
      game: {
        name: 'Mobile Legends',
        image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop'
      },
      package: {
        amount: '275 Diamonds',
        price: 75000
      },
      status: 'completed',
      payment_method: 'QRIS',
      total_amount: 75000,
      created_at: '2024-01-21T10:30:00Z',
      completed_at: '2024-01-21T10:32:00Z',
      vip_order_id: 'VIP123456'
    },
    {
      id: 'TRX002',
      user_id: 'user2',
      user: {
        full_name: 'Siti Nurhaliza',
        email: 'siti.nur@email.com',
        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      game: {
        name: 'Free Fire',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop'
      },
      package: {
        amount: '720 Diamonds',
        price: 150000
      },
      status: 'processing',
      payment_method: 'Bank Transfer',
      total_amount: 150000,
      created_at: '2024-01-21T09:45:00Z',
      vip_order_id: 'VIP123457'
    },
    {
      id: 'TRX003',
      user_id: 'user3',
      user: {
        full_name: 'Budi Santoso',
        email: 'budi.santoso@email.com',
        avatar_url: null
      },
      game: {
        name: 'PUBG Mobile',
        image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=100&h=100&fit=crop'
      },
      package: {
        amount: '1800 UC',
        price: 300000
      },
      status: 'failed',
      payment_method: 'E-Wallet',
      total_amount: 300000,
      created_at: '2024-01-21T08:20:00Z',
      failed_at: '2024-01-21T08:25:00Z',
      vip_order_id: 'VIP123458',
      failure_reason: 'Insufficient VIP Reseller balance'
    },
    {
      id: 'TRX004',
      user_id: 'user4',
      user: {
        full_name: 'Maya Sari',
        email: 'maya.sari@email.com',
        avatar_url: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      game: {
        name: 'Genshin Impact',
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
      },
      package: {
        amount: '980 Genesis Crystals',
        price: 200000
      },
      status: 'completed',
      payment_method: 'Credit Card',
      total_amount: 200000,
      created_at: '2024-01-21T07:15:00Z',
      completed_at: '2024-01-21T07:18:00Z',
      vip_order_id: 'VIP123459'
    },
    {
      id: 'TRX005',
      user_id: 'user5',
      user: {
        full_name: 'Andi Wijaya',
        email: 'andi.wijaya@email.com',
        avatar_url: null
      },
      game: {
        name: 'Valorant',
        image_url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=100&h=100&fit=crop'
      },
      package: {
        amount: '2150 VP',
        price: 250000
      },
      status: 'pending',
      payment_method: 'Bank Transfer',
      total_amount: 250000,
      created_at: '2024-01-21T06:30:00Z',
      vip_order_id: 'VIP123460'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  const filteredTransactions = displayTransactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.status === filter;
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/10';
      case 'processing':
        return 'text-blue-500 bg-blue-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-text-secondary bg-surface/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'processing':
        return 'Clock';
      case 'pending':
        return 'AlertCircle';
      case 'failed':
        return 'XCircle';
      default:
        return 'HelpCircle';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-gaming">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Activity" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-gaming font-bold text-foreground">
              Recent Transactions
            </h3>
            <p className="text-sm text-text-secondary">
              Latest customer orders and payments
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filter */}
          <div className="flex items-center gap-2">
            {['all', 'completed', 'processing', 'pending', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? 'bg-primary text-black'
                    : 'bg-surface/20 text-text-secondary hover:text-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
              title="Refresh Transactions"
            >
              <Icon 
                name="RefreshCw" 
                size={16} 
                className={`text-text-secondary ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
            
            <Link to="/admin/transactions">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-border">
        {filteredTransactions.slice(0, 10).map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-surface/5 transition-colors">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {transaction.user?.avatar_url ? (
                  <Image
                    src={transaction.user.avatar_url}
                    alt={transaction.user.full_name}
                    className="w-12 h-12 rounded-full border-2 border-border"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-black">
                      {getInitials(transaction.user?.full_name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Transaction Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {transaction.user?.full_name || 'Unknown User'}
                  </span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-sm text-text-secondary">
                    {transaction.id}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={transaction.game?.image_url || 'https://via.placeholder.com/24x24'}
                    alt={transaction.game?.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                  <span className="text-sm text-foreground">
                    {transaction.game?.name}
                  </span>
                  <span className="text-text-secondary">•</span>
                  <span className="text-sm text-text-secondary">
                    {transaction.package?.amount}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>{transaction.payment_method}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.created_at)}</span>
                  {transaction.vip_order_id && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-xs">VIP: {transaction.vip_order_id}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Amount */}
              <div className="flex-shrink-0 text-right">
                <div className="flex items-center justify-end gap-2 mb-2">
                  <Icon 
                    name={getStatusIcon(transaction.status)} 
                    size={16} 
                    className={getStatusColor(transaction.status).split(' ')[0]} 
                  />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                
                <div className="font-gaming font-bold text-foreground">
                  {formatCurrency(transaction.total_amount)}
                </div>
                
                {transaction.failure_reason && (
                  <div className="text-xs text-red-500 mt-1 max-w-32 truncate" title={transaction.failure_reason}>
                    {transaction.failure_reason}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0">
                <Link to={`/admin/transactions/${transaction.id}`}>
                  <button className="p-2 hover:bg-surface/50 rounded-lg transition-colors">
                    <Icon name="ExternalLink" size={16} className="text-text-secondary" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTransactions.length === 0 && (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Activity" size={32} className="text-text-secondary" />
          </div>
          <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
            No Transactions Found
          </h3>
          <p className="text-text-secondary">
            {filter === 'all' 
              ? 'No transactions have been made yet.' 
              : `No ${filter} transactions found.`
            }
          </p>
        </div>
      )}

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="p-4 border-t border-border bg-surface/5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Showing {Math.min(filteredTransactions.length, 10)} of {filteredTransactions.length} transactions
            </span>
            <Link to="/admin/transactions">
              <Button variant="outline" size="sm">
                <Icon name="ArrowRight" size={14} className="mr-2" />
                View All Transactions
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;