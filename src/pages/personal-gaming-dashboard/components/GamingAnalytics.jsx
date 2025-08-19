import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const GamingAnalytics = ({ analyticsData }) => {
  const [activeTab, setActiveTab] = useState('spending');

  const tabs = [
    { id: 'spending', label: 'Pengeluaran', icon: 'TrendingUp' },
    { id: 'games', label: 'Game Favorit', icon: 'Gamepad2' },
    { id: 'patterns', label: 'Pola Pembelian', icon: 'BarChart3' }
  ];

  const COLORS = ['#00d4ff', '#8b5cf6', '#ffd700', '#10b981', '#f59e0b', '#ef4444'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-gaming">
          <p className="text-foreground font-medium">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name?.includes('Rp') ? entry?.value?.toLocaleString('id-ID') : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderSpendingAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending Chart */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Calendar" size={20} className="text-primary mr-2" />
            Pengeluaran Bulanan
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis dataKey="month" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Category */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="PieChart" size={20} className="text-primary mr-2" />
            Kategori Pengeluaran
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData?.spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData?.spendingByCategory?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {analyticsData?.spendingByCategory?.map((entry, index) => (
              <div key={entry?.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                ></div>
                <span className="text-sm text-text-secondary">{entry?.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center space-x-3">
            <Icon name="TrendingUp" size={24} className="text-primary" />
            <div>
              <p className="text-sm text-text-secondary">Rata-rata Bulanan</p>
              <p className="text-lg font-bold text-primary">
                Rp {analyticsData?.insights?.averageMonthly?.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-success/10 rounded-lg p-4 border border-success/20">
          <div className="flex items-center space-x-3">
            <Icon name="Target" size={24} className="text-success" />
            <div>
              <p className="text-sm text-text-secondary">Hemat Bulan Ini</p>
              <p className="text-lg font-bold text-success">
                Rp {analyticsData?.insights?.savedThisMonth?.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-warning/10 rounded-lg p-4 border border-warning/20">
          <div className="flex items-center space-x-3">
            <Icon name="Clock" size={24} className="text-warning" />
            <div>
              <p className="text-sm text-text-secondary">Waktu Favorit</p>
              <p className="text-lg font-bold text-warning">
                {analyticsData?.insights?.favoriteTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg p-4 border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Gamepad2" size={20} className="text-primary mr-2" />
          Top 5 Game Favorit
        </h4>
        <div className="space-y-3">
          {analyticsData?.topGames?.map((game, index) => (
            <div key={game?.name} className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{game?.name}</p>
                  <p className="text-sm text-text-secondary">{game?.transactions} transaksi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">
                  Rp {game?.totalSpent?.toLocaleString('id-ID')}
                </p>
                <div className="w-24 bg-muted rounded-full h-2 mt-1">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(game?.totalSpent / analyticsData?.topGames?.[0]?.totalSpent) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPatternAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Patterns */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Clock" size={20} className="text-primary mr-2" />
            Pola Pembelian Harian
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData?.dailyPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis dataKey="hour" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="purchases" 
                  stroke="#00d4ff" 
                  strokeWidth={2}
                  dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Patterns */}
        <div className="bg-surface rounded-lg p-4 border border-border">
          <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Icon name="Calendar" size={20} className="text-primary mr-2" />
            Aktivitas Mingguan
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData?.weeklyPatterns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis dataKey="day" stroke="#a3a3a3" fontSize={12} />
                <YAxis stroke="#a3a3a3" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Lightbulb" size={20} className="text-primary mr-2" />
          Rekomendasi Optimasi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData?.recommendations?.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
              <Icon name={rec?.icon} size={20} className="text-primary mt-1" />
              <div>
                <h5 className="font-medium text-foreground">{rec?.title}</h5>
                <p className="text-sm text-text-secondary">{rec?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-gaming font-bold text-foreground flex items-center">
          <Icon name="BarChart3" size={24} className="text-primary mr-3" />
          Analitik Gaming
        </h2>
        <div className="flex items-center space-x-2">
          <Icon name="Download" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">Export Data</span>
        </div>
      </div>
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab?.id
                ? 'bg-primary text-primary-foreground shadow-neon-blue'
                : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span className="text-sm font-medium">{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div>
        {activeTab === 'spending' && renderSpendingAnalytics()}
        {activeTab === 'games' && renderGameAnalytics()}
        {activeTab === 'patterns' && renderPatternAnalytics()}
      </div>
    </div>
  );
};

export default GamingAnalytics;