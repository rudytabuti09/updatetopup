import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TransactionHistory = ({ transactions }) => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const filterOptions = [
    { value: 'all', label: 'Semua', icon: 'List' },
    { value: 'success', label: 'Berhasil', icon: 'CheckCircle' },
    { value: 'pending', label: 'Pending', icon: 'Clock' },
    { value: 'failed', label: 'Gagal', icon: 'XCircle' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'failed': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'pending': return 'Clock';
      case 'failed': return 'XCircle';
      default: return 'Circle';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'success': return 'Berhasil';
      case 'pending': return 'Pending';
      case 'failed': return 'Gagal';
      default: return 'Unknown';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => 
    filter === 'all' || transaction?.status === filter
  );

  const displayedTransactions = showAll ? filteredTransactions : filteredTransactions?.slice(0, 5);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="History" size={24} className="text-primary mr-3" />
          Riwayat Transaksi
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <Icon name="Download" size={16} className="mr-2" />
          Export
        </Button>
      </div>
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              filter === option?.value
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Icon name={option?.icon} size={16} />
            <span className="text-sm font-medium">{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Transaction List */}
      <div className="space-y-4">
        {displayedTransactions?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="FileX" size={48} className="text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          displayedTransactions?.map((transaction) => (
            <div
              key={transaction?.id}
              className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:border-primary/30 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Image
                    src={transaction?.gameIcon}
                    alt={transaction?.gameName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${getStatusColor(transaction?.status)}`}>
                    <Icon name={getStatusIcon(transaction?.status)} size={10} />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {transaction?.gameName}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {transaction?.package} • {transaction?.method}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatDate(transaction?.date)} • {formatTime(transaction?.date)}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-bold text-foreground">
                      Rp {transaction?.amount?.toLocaleString('id-ID')}
                    </p>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction?.status)}`}>
                      <Icon name={getStatusIcon(transaction?.status)} size={12} />
                      <span>{getStatusText(transaction?.status)}</span>
                    </div>
                  </div>
                  {transaction?.status === 'success' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                      onClick={() => console.log(`Reorder: ${transaction?.id}`)}
                    >
                      <Icon name="RotateCcw" size={16} className="mr-1" />
                      Ulangi
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Show More Button */}
      {filteredTransactions?.length > 5 && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            {showAll ? (
              <>
                <Icon name="ChevronUp" size={16} className="mr-2" />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <Icon name="ChevronDown" size={16} className="mr-2" />
                Tampilkan Semua ({filteredTransactions?.length - 5} lainnya)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;