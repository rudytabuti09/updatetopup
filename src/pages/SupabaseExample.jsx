import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useAuth } from '../contexts/AuthContext'
import { useGame } from '../contexts/GameContext'
import useSupabaseData from '../hooks/useSupabaseData'
import SupabaseGameCard from '../components/SupabaseGameCard'
import Icon from '../components/AppIcon'

// Contoh halaman yang menggunakan data dari Supabase
const SupabaseExample = () => {
  const { user, signOut } = useAuth()
  const { loading } = useGame()
  const {
    trendingGames,
    promoOffers,
    categories,
    systemSettings,
    isLoading,
    userTransactions,
    refreshData
  } = useSupabaseData()

  useEffect(() => {
    // Refresh data when component mounts
    refreshData()
  }, [])

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Supabase data...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Supabase Integration Example - WMX TOPUP</title>
        <meta name="description" content="Example page showing Supabase integration with WMX TOPUP" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border py-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Database" size={20} className="text-black" />
                </div>
                <div>
                  <h1 className="text-xl hero-title text-gaming-gradient">
                    Supabase Integration
                  </h1>
                  <p className="text-sm text-text-secondary">
                    Real-time data from Supabase
                  </p>
                </div>
              </div>

              {user && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      Welcome, {user.email}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {userTransactions.length} transactions
                    </p>
                  </div>
                  <button
                    onClick={signOut}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* System Stats */}
          <section className="mb-12">
            <h2 className="text-2xl font-gaming font-bold text-foreground mb-6">
              System Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="gaming-card p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Gamepad2" size={24} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {systemSettings.total_games || '150+'}
                </div>
                <div className="text-sm text-text-secondary">Total Games</div>
              </div>

              <div className="gaming-card p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Clock" size={24} className="text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary mb-1">
                  {systemSettings.support_hours || '24/7'}
                </div>
                <div className="text-sm text-text-secondary">Support</div>
              </div>

              <div className="gaming-card p-6 text-center">
                <div className="w-12 h-12 bg-gaming-gold/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="TrendingUp" size={24} className="text-gaming-gold" />
                </div>
                <div className="text-2xl font-bold text-gaming-gold mb-1">
                  {systemSettings.success_rate || '99.9%'}
                </div>
                <div className="text-sm text-text-secondary">Success Rate</div>
              </div>

              <div className="gaming-card p-6 text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Icon name="Users" size={24} className="text-green-500" />
                </div>
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {user ? '1' : '0'}
                </div>
                <div className="text-sm text-text-secondary">Logged In</div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-gaming font-bold text-foreground mb-6">
              Game Categories
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="gaming-card p-4 text-center hover:scale-105 transition-transform">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon name={category.icon} size={20} className="text-primary" />
                  </div>
                  <div className="text-sm font-medium text-foreground mb-1">
                    {category.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {category.count} games
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Active Promotions */}
          {promoOffers.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-gaming font-bold text-foreground mb-6">
                Active Promotions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoOffers.map((promo) => (
                  <div key={promo.id} className="gaming-card overflow-hidden">
                    <div 
                      className="h-32 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${promo.backgroundImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute top-3 left-3">
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {promo.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-gaming font-bold text-lg mb-1">
                          {promo.title}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {promo.gameName}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-text-secondary text-sm mb-3">
                        {promo.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-red-500">
                          {promo.discount}% OFF
                        </div>
                        <button className="bg-gradient-to-r from-primary to-secondary text-black px-4 py-2 rounded-lg font-gaming font-semibold text-sm hover:shadow-neon-glow transition-all duration-200">
                          Claim Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trending Games */}
          <section className="mb-12">
            <h2 className="text-2xl font-gaming font-bold text-foreground mb-6">
              Trending Games from Supabase
            </h2>
            {trendingGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingGames.map((game) => (
                  <SupabaseGameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Database" size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-gaming font-bold text-foreground mb-2">
                  No Games Found
                </h3>
                <p className="text-text-secondary">
                  Make sure your Supabase is configured correctly and has sample data.
                </p>
              </div>
            )}
          </section>

          {/* User Transactions (if logged in) */}
          {user && userTransactions.length > 0 && (
            <section>
              <h2 className="text-2xl font-gaming font-bold text-foreground mb-6">
                Recent Transactions
              </h2>
              <div className="gaming-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface/50">
                      <tr>
                        <th className="text-left p-4 font-gaming font-semibold text-foreground">Game</th>
                        <th className="text-left p-4 font-gaming font-semibold text-foreground">Package</th>
                        <th className="text-left p-4 font-gaming font-semibold text-foreground">Amount</th>
                        <th className="text-left p-4 font-gaming font-semibold text-foreground">Status</th>
                        <th className="text-left p-4 font-gaming font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-t border-border/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={transaction.games?.icon_url} 
                                alt={transaction.games?.name}
                                className="w-8 h-8 rounded"
                              />
                              <span className="font-medium text-foreground">
                                {transaction.games?.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-text-secondary">
                            {transaction.game_packages?.amount}
                          </td>
                          <td className="p-4 font-semibold text-primary">
                            {new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0
                            }).format(transaction.total_amount)}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              transaction.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="p-4 text-text-secondary text-sm">
                            {new Date(transaction.created_at).toLocaleDateString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  )
}

export default SupabaseExample