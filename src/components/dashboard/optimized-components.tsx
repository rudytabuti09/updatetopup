import React, { memo } from 'react'
import { ShoppingBag, Wallet, Clock, TrendingUp, Calendar } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { GradientButton } from '@/components/ui/gradient-button'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'
import type { DashboardStats, RecentOrder } from '@/hooks/use-dashboard-optimized'

// Memoized stat card to prevent unnecessary re-renders
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  gradient: string
  textColor: string
  glowColor?: string
  isAnimating?: boolean
}

export const StatCard = memo<StatCardProps>(({ 
  title, 
  value, 
  icon, 
  gradient, 
  textColor, 
  glowColor, 
  isAnimating = false 
}) => {
  return (
    <GlassCard hover>
      <div className="flex items-center">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center relative",
          gradient
        )}>
          {icon}
          <div className={cn(
            "absolute inset-0 blur-lg rounded-lg",
            glowColor
          )} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-wmx-gray-600">{title}</p>
          <p className={cn(
            "text-2xl font-bold transition-all duration-500",
            textColor,
            isAnimating && "animate-pulse scale-105"
          )}>
            {value}
          </p>
        </div>
      </div>
    </GlassCard>
  )
})

StatCard.displayName = 'StatCard'

// Memoized order item to prevent unnecessary re-renders
interface OrderItemProps {
  order: RecentOrder
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  convertOrderStatus: (status: string) => 'pending' | 'processing' | 'success' | 'failed' | 'waiting' | 'cancelled'
}

export const OrderItem = memo<OrderItemProps>(({ 
  order, 
  formatCurrency, 
  formatDate, 
  convertOrderStatus 
}) => {
  return (
    <div className="p-4 rounded-lg bg-white/80 border border-neon-magenta/20 hover:border-neon-magenta/40 transition-all duration-300 hover:shadow-glow-magenta group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue flex items-center justify-center relative">
            <ShoppingBag className="h-4 w-4 text-white relative z-10" />
            <div className="absolute inset-0 bg-neon-cyan/20 blur-lg rounded-lg" />
          </div>
          <div>
            <p className="font-medium text-wmx-dark text-sm font-retro">{order.service}</p>
            <p className="text-xs text-wmx-gray-600">{order.orderNumber}</p>
          </div>
        </div>
        <StatusBadge status={convertOrderStatus(order.status)} />
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-wmx-gray-600">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(order.createdAt)}
        </div>
        <div className="font-bold text-glow-cyan">
          {formatCurrency(order.amount)}
        </div>
      </div>
    </div>
  )
})

OrderItem.displayName = 'OrderItem'

// Memoized stats grid
interface StatsGridProps {
  stats: DashboardStats | null
  animatingFields: Set<keyof DashboardStats>
  formatCurrency: (amount: number) => string
}

export const StatsGrid = memo<StatsGridProps>(({ stats, animatingFields, formatCurrency }) => {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Orders"
        value={stats.totalOrders}
        icon={<ShoppingBag className="h-6 w-6 text-white relative z-10" />}
        gradient="bg-gradient-to-r from-neon-cyan to-neon-blue"
        textColor="text-glow-cyan"
        glowColor="bg-neon-cyan/20"
        isAnimating={animatingFields.has('totalOrders')}
      />
      
      <StatCard
        title="Total Spent"
        value={formatCurrency(stats.totalSpent)}
        icon={<TrendingUp className="h-6 w-6 text-white relative z-10" />}
        gradient="bg-gradient-to-r from-retro-gold to-retro-orange"
        textColor="text-retro-gold"
        glowColor="bg-retro-gold/20"
        isAnimating={animatingFields.has('totalSpent')}
      />
      
      <StatCard
        title="Balance"
        value={formatCurrency(stats.balance)}
        icon={<Wallet className="h-6 w-6 text-white relative z-10" />}
        gradient="bg-gradient-to-r from-neon-magenta to-neon-pink"
        textColor="text-glow-magenta"
        glowColor="bg-neon-magenta/20"
        isAnimating={animatingFields.has('balance')}
      />
      
      <StatCard
        title="Pending Orders"
        value={stats.pendingOrders}
        icon={<Clock className="h-6 w-6 text-white relative z-10" />}
        gradient="bg-gradient-to-r from-neon-purple to-retro-orange"
        textColor="text-neon-purple"
        glowColor="bg-neon-purple/20"
        isAnimating={animatingFields.has('pendingOrders')}
      />
    </div>
  )
})

StatsGrid.displayName = 'StatsGrid'

// Memoized orders list
interface OrdersListProps {
  orders: RecentOrder[]
  formatCurrency: (amount: number) => string
  formatDate: (date: string) => string
  convertOrderStatus: (status: string) => 'pending' | 'processing' | 'success' | 'failed' | 'waiting' | 'cancelled'
  onViewAll: () => void
}

export const OrdersList = memo<OrdersListProps>(({ 
  orders, 
  formatCurrency, 
  formatDate, 
  convertOrderStatus, 
  onViewAll 
}) => {
  return (
    <GlassCard hover>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-wmx-dark">Recent Orders</h2>
        <GradientButton 
          variant="secondary" 
          size="sm"
          onClick={onViewAll}
        >
          <div className="flex items-center">
            View All
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </GradientButton>
      </div>

      <div className="space-y-4">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              convertOrderStatus={convertOrderStatus}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 text-wmx-gray-400 mx-auto mb-4" />
            <p className="text-wmx-gray-500">No recent orders found</p>
            <p className="text-xs text-wmx-gray-400 mt-2">Your recent orders will appear here</p>
          </div>
        )}
      </div>
    </GlassCard>
  )
})

OrdersList.displayName = 'OrdersList'

// Memoized quick actions
interface QuickActionsProps {
  onShop: () => void
  onOrders: () => void
  onBalance: () => void
}

export const QuickActions = memo<QuickActionsProps>(({ onShop, onOrders, onBalance }) => {
  return (
    <GlassCard hover>
      <h2 className="text-xl font-heading font-bold text-wmx-dark mb-6">Quick Actions</h2>
      
      <div className="space-y-4">
        <GradientButton 
          className="w-full justify-start"
          onClick={onShop}
        >
          <ShoppingBag className="mr-3 h-5 w-5" />
          Shop New Products
        </GradientButton>
        
        <GradientButton 
          variant="secondary"
          className="w-full justify-start"
          onClick={onOrders}
        >
          <Clock className="mr-3 h-5 w-5" />
          Check Order Status
        </GradientButton>
        
        <GradientButton 
          variant="sunset"
          className="w-full justify-start"
          onClick={onBalance}
        >
          <Wallet className="mr-3 h-5 w-5" />
          Top Up Balance
        </GradientButton>
      </div>

      {/* Recent Activity - Static content */}
      <div className="mt-8">
        <h3 className="text-lg font-heading font-semibold text-wmx-dark mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-green/20">
            <div className="w-2 h-2 rounded-full bg-neon-green mt-2 animate-pulse" />
            <div>
              <p className="text-sm text-wmx-dark font-medium">ML Diamond order completed</p>
              <p className="text-xs text-wmx-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-cyan/20">
            <div className="w-2 h-2 rounded-full bg-neon-cyan mt-2 animate-pulse" />
            <div>
              <p className="text-sm text-wmx-dark font-medium">Login from new device</p>
              <p className="text-xs text-wmx-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 border border-neon-purple/20">
            <div className="w-2 h-2 rounded-full bg-neon-purple mt-2 animate-pulse" />
            <div>
              <p className="text-sm text-wmx-dark font-medium">Profile updated successfully</p>
              <p className="text-xs text-wmx-gray-600">3 days ago</p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  )
})

QuickActions.displayName = 'QuickActions'
