import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useNotification } from '../contexts/NotificationContext'
import useSupabaseData from '../hooks/useSupabaseData'
import Header from '../components/ui/Header'
import Icon from '../components/AppIcon'
import Image from '../components/AppImage'
import Button from '../components/ui/Button'
import AdminAccessTest from '../components/AdminAccessTest'
import ForceProfileRefresh from '../components/ForceProfileRefresh'

const Dashboard = () => {
  const { user, profile } = useAuth()
  const { showSuccess } = useNotification()
  const { 
    userTransactions, 
    userFavorites, 
    trendingGames,
    isLoading 
  } = useSupabaseData()

  const [activeTab, setActiveTab] = useState('overview')
  const [recentActivity, setRecentActivity] = useState([])

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Selamat Pagi'
    if (hour < 17) return 'Selamat Siang'
    return 'Selamat Malam'
  }

  // Get user level based on total spent
  const getUserLevel = () => {
    const totalSpent = profile?.total_spent || 0
    if (totalSpent >= 10000000) return 30
    if (totalSpent >= 5000000) return 25
    if (totalSpent >= 1000000) return 15
    if (totalSpent >= 500000) return 10
    return 5
  }

  // Get user tier based on total spent
  const getUserTier = () => {
    const totalSpent = profile?.total_spent || 0
    if (totalSpent >= 10000000) return 'Platinum'
    if (totalSpent >= 5000000) return 'Gold'
    if (totalSpent >= 1000000) return 'Silver'
    return 'Bronze'
  }

  // Dashboard tabs configuration
  const dashboardTabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'Home' },
    { id: 'transactions', label: 'Transaksi', icon: 'CreditCard' },
    { id: 'favorites', label: 'Favorit', icon: 'Heart' },
    { id: 'profile', label: 'Profil', icon: 'User' }
  ]

  // Quick action items
  const quickActionItems = [
    { icon: 'CreditCard', label: 'Top Up Cepat', action: 'quick-topup', path: '/game-selection-hub' },
    { icon: 'Gift', label: 'Klaim Reward', action: 'claim-rewards', path: '#' },
    { icon: 'Users', label: 'Ajak Teman', action: 'invite-friends', path: '#' },
    { icon: 'Settings', label: 'Pengaturan', action: 'settings', path: '#' }
  ]

  // Generate recent activity from real data
  useEffect(() => {
    const generateRecentActivity = () => {
      const activities = []
      
      // Add recent transactions
      if (userTransactions && userTransactions.length > 0) {
        userTransactions.slice(0, 3).forEach(transaction => {
          activities.push({
            id: `transaction-${transaction.id}`,
            type: 'transaction',
            title: `Top Up ${transaction.games?.name || 'Game'}`,
            description: `${transaction.game_packages?.amount || 'Package'} berhasil ditambahkan`,
            amount: formatCurrency(transaction.total_amount),
            status: transaction.status,
            timestamp: new Date(transaction.created_at),
            icon: 'CheckCircle',
            color: transaction.status === 'completed' ? 'text-green-500' : 
                   transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'
          })
        })
      }
      
      // Add recent favorites
      if (userFavorites && userFavorites.length > 0) {
        userFavorites.slice(0, 2).forEach(favorite => {
          activities.push({
            id: `favorite-${favorite.id}`,
            type: 'favorite',
            title: 'Game Favorit Ditambahkan',
            description: `${favorite.games?.name} ditambahkan ke favorit`,
            status: 'info',
            timestamp: new Date(favorite.created_at),
            icon: 'Heart',
            color: 'text-red-500'
          })
        })
      }
      
      // Sort by timestamp (newest first)
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      setRecentActivity(activities.slice(0, 5)) // Show max 5 activities
    }

    generateRecentActivity()
  }, [userTransactions, userFavorites])

  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes} menit yang lalu`
    } else if (hours < 24) {
      return `${hours} jam yang lalu`
    } else {
      return `${days} hari yang lalu`
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10'
      case 'pending': return 'text-yellow-500 bg-yellow-500/10'
      case 'failed': return 'text-red-500 bg-red-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Berhasil'
      case 'pending': return 'Pending'
      case 'failed': return 'Gagal'
      default: return 'Unknown'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - WMX TOPUP | Gaming Dashboard</title>
        <meta name="description" content="Dashboard pengguna WMX TOPUP untuk mengelola transaksi, favorit, dan aktivitas gaming." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Dashboard Header - Style seperti personal-gaming-dashboard */}
            <div className="bg-gradient-to-r from-card to-surface rounded-xl p-6 mb-8 border border-border shadow-gaming">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile?.full_name || profile?.username || 'User'}
                        className="w-16 h-16 rounded-full border-2 border-primary shadow-neon-blue"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full border-2 border-primary shadow-neon-blue flex items-center justify-center">
                        <span className="text-2xl font-bold text-black">
                          {(profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-background flex items-center justify-center">
                      <Icon name="Zap" size={12} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-gaming font-bold text-gaming-gradient">
                      {getGreeting()}, {profile?.full_name || profile?.username || 'User'}!
                    </h1>
                    <p className="text-text-secondary">
                      Level {getUserLevel()} • {getUserTier()} Member
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{profile?.total_transactions || 0}</div>
                    <div className="text-sm text-text-secondary">Total Top-ups</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary">{userFavorites?.length || 0}</div>
                    <div className="text-sm text-text-secondary">Favorite Games</div>
                  </div>
                  <div className="w-px h-12 bg-border"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gaming-gold">
                      Rp {((profile?.total_spent || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-text-secondary">Total Spent</div>
                  </div>
                </div>
              </div>
              {/* Mobile Stats */}
              <div className="md:hidden grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-lg">
                  <div className="text-lg font-bold text-primary">{profile?.total_transactions || 0}</div>
                  <div className="text-xs text-text-secondary">Top-ups</div>
                </div>
                <div className="text-center p-3 bg-secondary/10 rounded-lg">
                  <div className="text-lg font-bold text-secondary">{userFavorites?.length || 0}</div>
                  <div className="text-xs text-text-secondary">Games</div>
                </div>
                <div className="text-center p-3 bg-gaming-gold/10 rounded-lg">
                  <div className="text-lg font-bold text-gaming-gold">
                    Rp {((profile?.total_spent || 0) / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-text-secondary">Spent</div>
                </div>
              </div>
            </div>

            {/* Dashboard Navigation - Style seperti personal-gaming-dashboard */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
              <div className="flex flex-wrap gap-2">
                {dashboardTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground shadow-neon-blue'
                        : 'bg-surface text-text-secondary hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Quick Actions - Style seperti personal-gaming-dashboard */}
                  <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                    <h2 className="text-xl font-gaming font-bold text-foreground mb-6 flex items-center">
                      <Icon name="Zap" size={24} className="text-primary mr-3" />
                      Aksi Cepat
                    </h2>
                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      {quickActionItems.map((item, index) => (
                        <Link key={index} to={item.path}>
                          <Button
                            variant="outline"
                            className="h-20 w-full flex-col space-y-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                          >
                            <Icon name={item.icon} size={24} className="text-primary" />
                            <span className="text-sm font-medium">{item.label}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                    {/* Favorite Games */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">Game Favorit</h3>
                      {userFavorites && userFavorites.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {userFavorites.slice(0, 4).map((favorite) => (
                            <Link key={favorite.id} to="/game-selection-hub">
                              <div className="group cursor-pointer bg-surface rounded-lg p-4 border border-border hover:border-primary/40 hover:shadow-neon-blue transition-all duration-200">
                                <div className="flex flex-col items-center text-center space-y-3">
                                  <div className="relative">
                                    <Image
                                      src={favorite.games?.icon_url || 'https://via.placeholder.com/48'}
                                      alt={favorite.games?.name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                      <Icon name="Star" size={10} className="text-black fill-current" />
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                                      {favorite.games?.name}
                                    </h4>
                                    <p className="text-xs text-text-secondary">
                                      Favorit
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-surface/20 rounded-lg">
                          <Icon name="Heart" size={32} className="text-text-secondary mx-auto mb-2" />
                          <p className="text-text-secondary text-sm">Belum ada game favorit</p>
                          <Link to="/game-selection-hub" className="text-primary text-sm hover:text-primary/80">
                            Jelajahi game →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Recent Activity */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-gaming font-bold text-foreground">
                          Aktivitas Terbaru
                        </h2>
                        <button 
                          onClick={() => setActiveTab('transactions')}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          Lihat Semua →
                        </button>
                      </div>
                      <div className="space-y-4">
                        {recentActivity.length > 0 ? recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start gap-4 p-4 bg-surface/20 rounded-lg">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color} bg-current/10`}>
                              <Icon name={activity.icon} size={18} className={activity.color} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold text-foreground">{activity.title}</h3>
                                {activity.amount && (
                                  <span className="text-sm font-gaming font-semibold text-primary">
                                    {activity.amount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-text-secondary mb-2">{activity.description}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text-secondary">
                                  {formatDate(activity.timestamp)}
                                </span>
                                {activity.status && (
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                                    {getStatusText(activity.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8">
                            <Icon name="Activity" size={32} className="text-text-secondary mx-auto mb-2" />
                            <p className="text-text-secondary text-sm">Belum ada aktivitas</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trending Games */}
                    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                      <h3 className="text-lg font-gaming font-bold text-foreground mb-4">
                        Game Trending
                      </h3>
                      <div className="space-y-3">
                        {trendingGames.slice(0, 4).map((game) => (
                          <Link key={game.id} to="/game-selection-hub" className="flex items-center gap-3 p-3 bg-surface/20 rounded-lg hover:bg-surface/30 transition-colors">
                            <Image
                              src={game.image || 'https://via.placeholder.com/40'} 
                              alt={game.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground text-sm">{game.name}</h4>
                              <p className="text-xs text-text-secondary">{game.category}</p>
                            </div>
                            <Icon name="ChevronRight" size={16} className="text-text-secondary" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

                {activeTab === 'transactions' && (
                  <div className="gaming-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-gaming font-bold text-foreground">
                        Riwayat Transaksi
                      </h2>
                      <Link to="/game-selection-hub" className="text-primary hover:text-primary/80 text-sm font-medium">
                        Top Up Baru →
                      </Link>
                    </div>
                    {userTransactions && userTransactions.length > 0 ? (
                      <div className="space-y-4">
                        {userTransactions.map((transaction) => (
                          <div key={transaction.id} className="flex items-center justify-between p-4 bg-surface/20 rounded-lg">
                            <div className="flex items-center gap-4">
                              <img 
                                src={transaction.games?.icon_url || 'https://via.placeholder.com/40'} 
                                alt={transaction.games?.name}
                                className="w-10 h-10 rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-foreground">{transaction.games?.name}</h3>
                                <p className="text-sm text-text-secondary">
                                  {transaction.game_packages?.amount} • {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-gaming font-semibold text-primary">
                                {formatCurrency(transaction.total_amount)}
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                {getStatusText(transaction.status)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="History" size={32} className="text-text-secondary" />
                        </div>
                        <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                          Belum Ada Transaksi
                        </h3>
                        <p className="text-text-secondary mb-6">
                          Mulai top up game favorit Anda sekarang
                        </p>
                        <Link to="/game-selection-hub">
                          <button className="bg-gradient-to-r from-primary to-secondary text-black px-6 py-3 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200">
                            Mulai Top Up
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="gaming-card p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-gaming font-bold text-foreground">
                        Game Favorit
                      </h2>
                      <Link to="/game-selection-hub" className="text-primary hover:text-primary/80 text-sm font-medium">
                        Jelajahi Game →
                      </Link>
                    </div>
                    {userFavorites && userFavorites.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userFavorites.map((favorite) => (
                          <div key={favorite.id} className="flex items-center gap-4 p-4 bg-surface/20 rounded-lg">
                            <img 
                              src={favorite.games?.icon_url || 'https://via.placeholder.com/48'} 
                              alt={favorite.games?.name}
                              className="w-12 h-12 rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground">{favorite.games?.name}</h3>
                              <p className="text-sm text-text-secondary">{favorite.games?.category}</p>
                            </div>
                            <Link to="/game-selection-hub">
                              <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                Top Up
                              </button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Heart" size={32} className="text-text-secondary" />
                        </div>
                        <h3 className="text-lg font-gaming font-bold text-foreground mb-2">
                          Belum Ada Game Favorit
                        </h3>
                        <p className="text-text-secondary mb-6">
                          Tambahkan game favorit untuk akses yang lebih mudah
                        </p>
                        <Link to="/game-selection-hub">
                          <button className="bg-gradient-to-r from-primary to-secondary text-black px-6 py-3 rounded-lg font-gaming font-semibold hover:shadow-neon-glow transition-all duration-200">
                            Jelajahi Game
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="gaming-card p-6">
                    <h2 className="text-xl font-gaming font-bold text-foreground mb-6">
                      Informasi Profil
                    </h2>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          {profile?.avatar_url ? (
                            <img 
                              src={profile.avatar_url} 
                              alt="Avatar"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-black">
                              {(profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-gaming font-bold text-foreground">
                            {profile?.full_name || profile?.username || 'User'}
                          </h3>
                          <p className="text-text-secondary">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              profile?.is_verified 
                                ? 'bg-green-500/10 text-green-500' 
                                : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                              {profile?.is_verified ? 'Verified' : 'Unverified'}
                            </span>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                              {profile?.role || 'Customer'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                          <div className="p-3 bg-surface/20 rounded-lg text-text-secondary">
                            {profile?.username || 'Belum diset'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Nomor Telepon</label>
                          <div className="p-3 bg-surface/20 rounded-lg text-text-secondary">
                            {profile?.phone_number || 'Belum diset'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Tanggal Bergabung</label>
                          <div className="p-3 bg-surface/20 rounded-lg text-text-secondary">
                            {new Date(user?.created_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Status Member</label>
                          <div className="p-3 bg-surface/20 rounded-lg text-text-secondary">
                            {profile?.total_spent > 1000000 ? 'VIP Member' : 'Regular Member'}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-border/50">
                        <button className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-3 rounded-lg font-medium transition-colors">
                          <Icon name="Edit" size={18} className="mr-2" />
                          Edit Profil
                        </button>
                      </div>
                    </div>
                    
                    {/* Profile Debug & Refresh */}
                    <div className="mt-8">
                      <ForceProfileRefresh />
                    </div>
                    
                    {/* Admin Access Test - Only show in development */}
                    <AdminAccessTest />
                  </div>
                )}
            </div>

            {/* Quick Support */}
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                variant="default"
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary shadow-gaming-lg hover:shadow-neon-glow rounded-full w-14 h-14 p-0"
              >
                <Icon name="MessageCircle" size={24} />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Dashboard