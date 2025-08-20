import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import useSupabaseData from '../../hooks/useSupabaseData';
import { useVipResellerApi } from '../../hooks/useVipResellerApi';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Reports = () => {
  const { user, profile } = useAuth();
  const { allGames, userTransactions, isLoading } = useSupabaseData();
  const { checkBalance } = useVipResellerApi();
  const { showSuccess, showError } = useNotification();

  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('revenue');
  const [reportData, setReportData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'transactions', 'users']);

  useEffect(() => {
    generateReport();
  }, [dateRange, reportType]);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      // Mock report generation - in production, this would call your analytics API
      const mockData = await generateMockReportData();
      setReportData(mockData);
    } catch (error) {
      showError('Failed to generate report', 'Report Error');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReportData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    
    return {
      summary: {
        totalRevenue: 15750000,
        totalTransactions: 1250,
        totalUsers: 850,
        averageOrderValue: 12600,
        successRate: 94.5,
        topGame: 'Mobile Legends',
        topPaymentMethod: 'QRIS',
        growthRate: 12.5
      },
      dailyData: Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 800000) + 200000,
          transactions: Math.floor(Math.random() * 50) + 10,
          users: Math.floor(Math.random() * 30) + 5
        };
      }),
      gameBreakdown: [
        { name: 'Mobile Legends', revenue: 4500000, transactions: 380, percentage: 28.6 },
        { name: 'Free Fire', revenue: 3200000, transactions: 290, percentage: 20.3 },
        { name: 'PUBG Mobile', revenue: 2800000, transactions: 220, percentage: 17.8 },
        { name: 'Genshin Impact', revenue: 2100000, transactions: 150, percentage: 13.3 },
        { name: 'Valorant', revenue: 1800000, transactions: 120, percentage: 11.4 },
        { name: 'Others', revenue: 1350000, transactions: 90, percentage: 8.6 }
      ],
      paymentMethods: [
        { name: 'QRIS', amount: 5500000, transactions: 450, percentage: 34.9 },
        { name: 'Bank Transfer', amount: 4200000, transactions: 320, percentage: 26.7 },
        { name: 'E-Wallet', amount: 3800000, transactions: 280, percentage: 24.1 },
        { name: 'Credit Card', amount: 2250000, transactions: 200, percentage: 14.3 }
      ],
      hourlyPattern: Array.from({ length: 24 }, (_, hour) => ({
        hour,
        transactions: Math.floor(Math.random() * 30) + (hour >= 19 && hour <= 23 ? 20 : 5)
      })),
      topUsers: [
        { name: 'Ahmad Rizki', email: 'ahmad@email.com', spent: 850000, transactions: 25 },
        { name: 'Siti Nurhaliza', email: 'siti@email.com', spent: 720000, transactions: 22 },
        { name: 'Budi Santoso', email: 'budi@email.com', spent: 650000, transactions: 18 },
        { name: 'Maya Sari', email: 'maya@email.com', spent: 580000, transactions: 16 },
        { name: 'Andi Wijaya', email: 'andi@email.com', spent: 520000, transactions: 14 }
      ]
    };
  };

  const exportReport = async (format) => {
    try {
      setIsGenerating(true);
      // In production, this would generate and download the report
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess(`Report exported as ${format.toUpperCase()}`, 'Export Complete');
    } catch (error) {
      showError('Failed to export report', 'Export Error');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Reports & Analytics - WMX TOPUP Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <AdminHeader user={user} profile={profile} />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 ml-64 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-gaming font-bold text-gaming-gradient mb-2">
                  Reports & Analytics
                </h1>
                <p className="text-text-secondary">
                  Comprehensive business insights and performance metrics
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="90d">Last 90 Days</option>
                  <option value="1y">Last Year</option>
                </select>
                <Button onClick={generateReport} loading={isGenerating}>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Report Type Tabs */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { key: 'revenue', label: 'Revenue', icon: 'TrendingUp' },
                { key: 'transactions', label: 'Transactions', icon: 'Activity' },
                { key: 'users', label: 'Users', icon: 'Users' },
                { key: 'games', label: 'Games', icon: 'Gamepad2' }
              ].map((type) => (
                <button
                  key={type.key}
                  onClick={() => setReportType(type.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    reportType === type.key
                      ? 'bg-primary text-black'
                      : 'bg-surface/20 text-text-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={type.icon} size={16} />
                  {type.label}
                </button>
              ))}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {formatCurrency(reportData.summary?.totalRevenue || 0)}
                    </div>
                    <div className="text-sm text-text-secondary">Total Revenue</div>
                    <div className="text-xs text-green-500 mt-1">
                      +{formatPercentage(reportData.summary?.growthRate || 0)} vs last period
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Activity" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {reportData.summary?.totalTransactions?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-text-secondary">Total Transactions</div>
                    <div className="text-xs text-blue-500 mt-1">
                      {formatPercentage(reportData.summary?.successRate || 0)} success rate
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {reportData.summary?.totalUsers?.toLocaleString() || 0}
                    </div>
                    <div className="text-sm text-text-secondary">Active Users</div>
                    <div className="text-xs text-purple-500 mt-1">
                      {formatCurrency(reportData.summary?.averageOrderValue || 0)} avg order
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Trophy" size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-lg font-gaming font-bold text-foreground">
                      {reportData.summary?.topGame || 'N/A'}
                    </div>
                    <div className="text-sm text-text-secondary">Top Game</div>
                    <div className="text-xs text-orange-500 mt-1">
                      {reportData.summary?.topPaymentMethod || 'N/A'} top payment
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Revenue Trend Chart */}
              <div className="xl:col-span-2 bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground">
                    Revenue Trend
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-surface/50 rounded-lg transition-colors">
                      <Icon name="Download" size={16} className="text-text-secondary" />
                    </button>
                  </div>
                </div>
                
                {/* Simple Line Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-1">
                  {reportData.dailyData?.slice(-30).map((data, index) => {
                    const maxRevenue = Math.max(...(reportData.dailyData?.map(d => d.revenue) || [1]));
                    const height = (data.revenue / maxRevenue) * 100;
                    
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group cursor-pointer"
                      >
                        <div className="relative w-full flex items-end justify-center">
                          <div
                            className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-sm transition-all duration-300 group-hover:opacity-80"
                            style={{ height: `${Math.max(height, 2)}%` }}
                          />
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                            <div className="font-medium">{formatCurrency(data.revenue)}</div>
                            <div className="text-xs opacity-75">{data.transactions} transactions</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Games */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                  Top Games by Revenue
                </h3>
                <div className="space-y-4">
                  {reportData.gameBreakdown?.map((game, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-black">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{game.name}</div>
                        <div className="text-sm text-text-secondary">
                          {game.transactions} transactions
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-gaming font-bold text-foreground">
                          {formatCurrency(game.revenue)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatPercentage(game.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Methods & Hourly Pattern */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Payment Methods */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                  Payment Methods
                </h3>
                <div className="space-y-4">
                  {reportData.paymentMethods?.map((method, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface/20 rounded-lg flex items-center justify-center">
                          <Icon 
                            name={
                              method.name === 'QRIS' ? 'QrCode' :
                              method.name === 'Bank Transfer' ? 'Building2' :
                              method.name === 'E-Wallet' ? 'Smartphone' :
                              'CreditCard'
                            } 
                            size={18} 
                            className="text-text-secondary" 
                          />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{method.name}</div>
                          <div className="text-sm text-text-secondary">
                            {method.transactions} transactions
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-gaming font-bold text-foreground">
                          {formatCurrency(method.amount)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {formatPercentage(method.percentage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Users */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                  Top Customers
                </h3>
                <div className="space-y-4">
                  {reportData.topUsers?.map((customer, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-black">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{customer.name}</div>
                        <div className="text-sm text-text-secondary truncate">{customer.email}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-gaming font-bold text-foreground">
                          {formatCurrency(customer.spent)}
                        </div>
                        <div className="text-xs text-text-secondary">
                          {customer.transactions} orders
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                    Export Reports
                  </h3>
                  <p className="text-text-secondary">
                    Download detailed reports in various formats
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => exportReport('pdf')}
                    loading={isGenerating}
                  >
                    <Icon name="FileText" size={16} className="mr-2" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => exportReport('excel')}
                    loading={isGenerating}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Export Excel
                  </Button>
                  <Button 
                    onClick={() => exportReport('csv')}
                    loading={isGenerating}
                  >
                    <Icon name="Database" size={16} className="mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Reports;