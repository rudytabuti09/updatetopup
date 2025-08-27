'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { RefreshCw, WifiOff } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GradientButton } from '@/components/ui/gradient-button'
import { Spinner } from '@/components/ui/loading'
import { useRouter } from 'next/navigation'
import { useDashboard, useAnimatedStats } from '@/hooks/use-dashboard-optimized'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { StatsGrid, OrdersList, QuickActions } from '@/components/dashboard/optimized-components'

// Memoized dashboard page for optimal performance
const DashboardPage = React.memo(() => {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  // Real-time dashboard data with optimized polling
  const { data, loading, error, isOnline, lastUpdate, refetch } = useDashboard({
    enableRealtime: true,
    pollingInterval: 30000, // 30 seconds
    onBalanceChange: React.useCallback((newBalance: number) => {
      // Show notification when balance changes
      toast({
        title: 'Balance Updated',
        description: `Your balance is now ${formatCurrency(newBalance)}`,
        variant: 'default'
      })
    }, [toast]),
    onOrderUpdate: React.useCallback(() => {
      // Already handled in the hook via toast notifications
    }, [])
  })

  // Animated stats for smooth transitions
  const { stats: animatedStats, animatingFields } = useAnimatedStats(data?.stats || null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const convertOrderStatus = (status: string): 'pending' | 'processing' | 'success' | 'failed' | 'waiting' | 'cancelled' => {
    switch (status) {
      case 'PENDING': return 'pending'
      case 'WAITING_PAYMENT': return 'waiting'
      case 'PROCESSING': return 'processing'
      case 'SUCCESS': return 'success'
      case 'FAILED': return 'failed'
      case 'CANCELLED': return 'cancelled'
      case 'REFUNDED': return 'cancelled'
      default: return 'pending'
    }
  }

  // Memoized navigation callbacks to prevent re-renders (moved before conditionals)
  const handleViewAllOrders = React.useCallback(() => {
    router.push('/dashboard/orders')
  }, [router])

  const handleShopNavigation = React.useCallback(() => {
    router.push('/catalog')
  }, [router])

  const handleOrdersNavigation = React.useCallback(() => {
    router.push('/dashboard/orders')
  }, [router])

  const handleBalanceNavigation = React.useCallback(() => {
    router.push('/dashboard/balance')
  }, [router])

  // Memoized format functions
  const memoizedFormatCurrency = React.useCallback(formatCurrency, [])
  const memoizedFormatDate = React.useCallback(formatDate, [])
  const memoizedConvertOrderStatus = React.useCallback(convertOrderStatus, [])

  // Show error state
  if (error && !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <WifiOff className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500 mb-4">{error}</p>
            <GradientButton onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </GradientButton>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Spinner size="xl" className="mb-4" />
            <p className="text-white/70">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Welcome Section with Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-wmx-dark mb-2">
              <span className="text-glow-magenta">Welcome back,</span> {session?.user?.name}! 🎮
            </h1>
            <p className="text-wmx-gray-600">
              Manage your orders and track your gaming activities
            </p>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-4">
            {/* Online/Offline status */}
            <div className={cn(
              "flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300",
              isOnline 
                ? "bg-neon-green/20 text-neon-green border border-neon-green/30" 
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            )}>
              <div className={cn(
                "w-2 h-2 rounded-full mr-2 animate-pulse",
                isOnline ? "bg-neon-green" : "bg-red-400"
              )} />
              {isOnline ? 'Live' : 'Offline'}
            </div>
            
            {/* Manual refresh button */}
            <GradientButton 
              size="sm" 
              variant="secondary"
              onClick={refetch}
              disabled={loading}
            >
              <RefreshCw className={cn(
                "h-4 w-4 transition-transform duration-200", 
                loading && "animate-spin"
              )} />
            </GradientButton>
            
            {/* Last update time */}
            {lastUpdate && (
              <div className="text-xs text-wmx-gray-500">
                Last updated: {new Date(lastUpdate).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Optimized Stats Grid */}
      <StatsGrid 
        stats={animatedStats}
        animatingFields={animatingFields}
        formatCurrency={memoizedFormatCurrency}
      />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimized Orders List */}
        <OrdersList
          orders={data?.recentOrders || []}
          formatCurrency={memoizedFormatCurrency}
          formatDate={memoizedFormatDate}
          convertOrderStatus={memoizedConvertOrderStatus}
          onViewAll={handleViewAllOrders}
        />

        {/* Optimized Quick Actions */}
        <QuickActions
          onShop={handleShopNavigation}
          onOrders={handleOrdersNavigation}
          onBalance={handleBalanceNavigation}
        />
      </div>
    </DashboardLayout>
  )
})

DashboardPage.displayName = 'DashboardPage'

export default DashboardPage
