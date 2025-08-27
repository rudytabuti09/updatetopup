import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast, createToast } from '@/components/ui/toast'

export interface DashboardStats {
  totalOrders: number
  totalSpent: number
  pendingOrders: number
  successOrders: number
  balance: number
}

export interface RecentOrder {
  id: string
  orderNumber: string
  service: string
  amount: number
  status: string
  createdAt: string
  serviceLogo?: string
}

export interface RecentTransaction {
  id: string
  type: string
  amount: number
  description: string
  createdAt: string
  balanceBefore: number
  balanceAfter: number
}

export interface DashboardData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  recentTransactions: RecentTransaction[]
  lastUpdate: string
}

interface UseDashboardOptions {
  enableRealtime?: boolean
  pollingInterval?: number
  onBalanceChange?: (newBalance: number) => void
  onOrderUpdate?: (order: RecentOrder) => void
}

export function useDashboard(options: UseDashboardOptions = {}) {
  const {
    enableRealtime = true,
    pollingInterval = 30000, // 30 seconds
    onBalanceChange,
    onOrderUpdate
  } = options

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()

  // Initial data fetch
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    setError(null)

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch('/api/dashboard', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const dashboardData = await response.json()
      
      const formattedData: DashboardData = {
        stats: {
          totalOrders: dashboardData.totalOrders,
          totalSpent: dashboardData.totalSpent,
          pendingOrders: dashboardData.pendingOrders,
          successOrders: dashboardData.successOrders,
          balance: dashboardData.balance
        },
        recentOrders: dashboardData.recentOrders || [],
        recentTransactions: dashboardData.recentTransactions || [],
        lastUpdate: new Date().toISOString()
      }

      setData(formattedData)
      setLastUpdate(formattedData.lastUpdate)
      setIsOnline(true)

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Request was cancelled, ignore
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(errorMessage)
      setIsOnline(false)

      if (!data) { // Only show toast if this is initial load
        toast(createToast.error('Failed to load dashboard', {
          description: errorMessage
        }))
      }
    } finally {
      setLoading(false)
    }
  }, [toast, data])

  // Real-time updates using polling
  const checkForUpdates = useCallback(async () => {
    if (!lastUpdate) return

    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastUpdate })
      })

      if (!response.ok) return

      const updateData = await response.json()
      
      if (updateData.hasUpdates && updateData.updates) {
        setData(prevData => {
          if (!prevData) return null

          const newData = { ...prevData }
          
          // Update balance if changed
          if (updateData.updates.balance !== undefined && updateData.updates.balance !== prevData.stats.balance) {
            newData.stats.balance = updateData.updates.balance
            onBalanceChange?.(updateData.updates.balance)
          }

          // Merge new orders
          if (updateData.updates.orders?.length > 0) {
            const existingOrderIds = new Set(prevData.recentOrders.map(o => o.id))
            const newOrders = updateData.updates.orders.filter((order: RecentOrder) => !existingOrderIds.has(order.id))
            
            if (newOrders.length > 0) {
              newData.recentOrders = [...newOrders, ...prevData.recentOrders].slice(0, 5)
              
              // Notify about new orders
              newOrders.forEach((order: RecentOrder) => {
                onOrderUpdate?.(order)
                
                // Show toast for important status updates
                if (order.status === 'SUCCESS') {
                  toast(createToast.success('Order Completed!', {
                    description: `Your ${order.service} order has been processed successfully.`
                  }))
                } else if (order.status === 'FAILED') {
                  toast(createToast.error('Order Failed', {
                    description: `Your ${order.service} order has failed. Please try again.`
                  }))
                }
              })
            }
          }

          // Merge new transactions
          if (updateData.updates.transactions?.length > 0) {
            const existingTxIds = new Set(prevData.recentTransactions.map(t => t.id))
            const newTransactions = updateData.updates.transactions.filter((tx: RecentTransaction) => !existingTxIds.has(tx.id))
            
            if (newTransactions.length > 0) {
              newData.recentTransactions = [...newTransactions, ...prevData.recentTransactions].slice(0, 10)
            }
          }

          // Update stats based on new data
          if (updateData.updates.orders?.length > 0) {
            const successCount = updateData.updates.orders.filter((o: RecentOrder) => o.status === 'SUCCESS').length
            const pendingCount = updateData.updates.orders.filter((o: RecentOrder) => ['PENDING', 'WAITING_PAYMENT', 'PROCESSING'].includes(o.status)).length
            
            newData.stats.successOrders += successCount
            newData.stats.totalOrders += updateData.updates.orders.length
            newData.stats.pendingOrders += pendingCount
          }

          newData.lastUpdate = updateData.lastUpdate
          return newData
        })

        setLastUpdate(updateData.lastUpdate)
        setIsOnline(true)
      }
    } catch (err) {
      console.warn('Failed to check for updates:', err)
      setIsOnline(false)
    }
  }, [lastUpdate, onBalanceChange, onOrderUpdate, toast])

  // Set up polling for real-time updates
  useEffect(() => {
    if (!enableRealtime || !data) return

    pollingRef.current = setInterval(() => {
      checkForUpdates()
    }, pollingInterval)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [enableRealtime, data, pollingInterval, checkForUpdates])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (data) {
        fetchDashboardData(false) // Refresh data when back online
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchDashboardData, data])

  // Initial fetch
  useEffect(() => {
    fetchDashboardData()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, []) // Empty dependency array for initial fetch only

  const refetch = useCallback(() => {
    fetchDashboardData(true)
  }, [fetchDashboardData])

  return {
    data,
    loading,
    error,
    isOnline,
    lastUpdate,
    refetch
  }
}

// Separate hook for optimized stats display with animations
export function useAnimatedStats(stats: DashboardStats | null) {
  const [displayStats, setDisplayStats] = useState(stats)
  const [animatingFields, setAnimatingFields] = useState<Set<keyof DashboardStats>>(new Set())

  useEffect(() => {
    if (!stats || !displayStats) {
      setDisplayStats(stats)
      return
    }

    const fieldsToAnimate: (keyof DashboardStats)[] = []
    const statsEntries = Object.entries(stats) as [keyof DashboardStats, number][]
    
    statsEntries.forEach(([key, newValue]) => {
      if (displayStats[key] !== newValue) {
        fieldsToAnimate.push(key)
      }
    })

    if (fieldsToAnimate.length === 0) return

    setAnimatingFields(new Set(fieldsToAnimate))

    // Animate the values
    const startTime = Date.now()
    const duration = 1000 // 1 second animation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const newDisplayStats = { ...displayStats }
      let hasChanges = false

      fieldsToAnimate.forEach(field => {
        const startValue = displayStats[field]
        const endValue = stats[field]
        const currentValue = startValue + (endValue - startValue) * easeOutCubic(progress)
        
        if (field === 'balance' || field === 'totalSpent') {
          newDisplayStats[field] = Math.round(currentValue)
        } else {
          newDisplayStats[field] = Math.round(currentValue)
        }
        hasChanges = true
      })

      if (hasChanges) {
        setDisplayStats(newDisplayStats)
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatingFields(new Set())
        setDisplayStats(stats)
      }
    }

    requestAnimationFrame(animate)
  }, [stats, displayStats])

  return {
    stats: displayStats,
    animatingFields
  }
}

// Easing function for smooth animations
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}
