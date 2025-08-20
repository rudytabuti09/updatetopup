import React, { useMemo } from 'react'
import Icon from './AppIcon'

const ActivityChart = ({ userTransactions }) => {
  const chartData = useMemo(() => {
    if (!userTransactions || userTransactions.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        day: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][i],
        amount: 0,
        transactions: 0
      }))
    }

    // Get last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    return last7Days.map(date => {
      const dayTransactions = userTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.created_at)
        return transactionDate.toDateString() === date.toDateString() &&
               transaction.status === 'completed'
      })

      const totalAmount = dayTransactions.reduce((sum, t) => sum + t.total_amount, 0)

      return {
        day: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()],
        amount: totalAmount,
        transactions: dayTransactions.length,
        date: date.toISOString().split('T')[0]
      }
    })
  }, [userTransactions])

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1)
  const maxTransactions = Math.max(...chartData.map(d => d.transactions), 1)

  const formatCurrency = (amount) => {
    if (amount === 0) return 'Rp 0'
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)}K`
    return `Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-gaming font-bold text-foreground">
            Aktivitas 7 Hari Terakhir
          </h3>
          <p className="text-sm text-text-secondary">
            Transaksi dan pengeluaran harian
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-text-secondary">Pengeluaran</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span className="text-text-secondary">Transaksi</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {chartData.map((data, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-8 text-sm font-medium text-text-secondary">
              {data.day}
            </div>
            
            <div className="flex-1 space-y-2">
              {/* Amount Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-surface/30 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                    style={{ width: `${(data.amount / maxAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-xs text-text-secondary text-right">
                  {formatCurrency(data.amount)}
                </div>
              </div>
              
              {/* Transactions Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-surface/30 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full transition-all duration-500"
                    style={{ width: `${(data.transactions / maxTransactions) * 100}%` }}
                  ></div>
                </div>
                <div className="w-16 text-xs text-text-secondary text-right">
                  {data.transactions} tx
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-gaming font-bold text-primary">
              {formatCurrency(chartData.reduce((sum, d) => sum + d.amount, 0))}
            </div>
            <div className="text-xs text-text-secondary">Total 7 Hari</div>
          </div>
          <div>
            <div className="text-lg font-gaming font-bold text-secondary">
              {chartData.reduce((sum, d) => sum + d.transactions, 0)}
            </div>
            <div className="text-xs text-text-secondary">Total Transaksi</div>
          </div>
          <div>
            <div className="text-lg font-gaming font-bold text-gaming-gold">
              {chartData.filter(d => d.transactions > 0).length}
            </div>
            <div className="text-xs text-text-secondary">Hari Aktif</div>
          </div>
        </div>
      </div>

      {chartData.every(d => d.amount === 0) && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-surface/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="BarChart3" size={32} className="text-text-secondary" />
          </div>
          <h4 className="font-gaming font-bold text-foreground mb-2">
            Belum Ada Aktivitas
          </h4>
          <p className="text-sm text-text-secondary">
            Mulai top up untuk melihat statistik aktivitas Anda
          </p>
        </div>
      )}
    </div>
  )
}

export default ActivityChart