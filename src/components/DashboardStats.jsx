import React from 'react'
import Icon from './AppIcon'

const DashboardStats = ({ profile, userTransactions, userFavorites }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getThisMonthSpending = () => {
    if (!userTransactions || userTransactions.length === 0) return 0
    
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    return userTransactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.created_at)
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear &&
               transaction.status === 'completed'
      })
      .reduce((total, transaction) => total + transaction.total_amount, 0)
  }

  const getSuccessRate = () => {
    if (!userTransactions || userTransactions.length === 0) return 100
    
    const completedTransactions = userTransactions.filter(t => t.status === 'completed').length
    return Math.round((completedTransactions / userTransactions.length) * 100)
  }

  const getMostPlayedGame = () => {
    if (!userTransactions || userTransactions.length === 0) return 'Belum ada'
    
    const gameCount = {}
    userTransactions.forEach(transaction => {
      const gameName = transaction.games?.name
      if (gameName) {
        gameCount[gameName] = (gameCount[gameName] || 0) + 1
      }
    })
    
    const mostPlayed = Object.entries(gameCount).reduce((a, b) => 
      gameCount[a[0]] > gameCount[b[0]] ? a : b
    )
    
    return mostPlayed ? mostPlayed[0] : 'Belum ada'
  }

  const stats = [
    {
      title: 'Total Transaksi',
      value: profile?.total_transactions || 0,
      icon: 'CreditCard',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Semua waktu'
    },
    {
      title: 'Total Pengeluaran',
      value: formatCurrency(profile?.total_spent || 0),
      icon: 'DollarSign',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      description: 'Semua waktu'
    },
    {
      title: 'Bulan Ini',
      value: formatCurrency(getThisMonthSpending()),
      icon: 'Calendar',
      color: 'text-gaming-gold',
      bgColor: 'bg-gaming-gold/10',
      description: 'Pengeluaran bulan ini'
    },
    {
      title: 'Game Favorit',
      value: userFavorites?.length || 0,
      icon: 'Heart',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      description: 'Game tersimpan'
    },
    {
      title: 'Success Rate',
      value: `${getSuccessRate()}%`,
      icon: 'TrendingUp',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      description: 'Transaksi berhasil'
    },
    {
      title: 'Game Terfavorit',
      value: getMostPlayedGame(),
      icon: 'Trophy',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      description: 'Paling sering dimainkan',
      isText: true
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="gaming-card p-6 hover:shadow-gaming-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
              <Icon name={stat.icon} size={24} className={stat.color} />
            </div>
            <div className="text-right">
              <div className="text-xs text-text-secondary uppercase tracking-wide">
                {stat.title}
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className={`text-2xl font-gaming font-bold text-foreground ${stat.isText ? 'text-lg' : ''}`}>
              {stat.value}
            </div>
          </div>
          
          <div className="text-sm text-text-secondary">
            {stat.description}
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats