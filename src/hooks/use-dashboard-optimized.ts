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

// Optimized debounce for API calls
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Performance optimized hook with memoization
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
  
  // Debounce refetch to prevent spam
  const debouncedPollingInterval = useDebounce(pollingInterval, 1000)

  // Memoized API call
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
          'Cache-Control': 'max-age=10', // Cache for 10 seconds
          'If-Modified-Since': lastUpdate || ''
        },
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const dashboardData = await response.json()
      
      const formattedData: DashboardData = {
        stats: {
          totalOrders: dashboardData.totalOrders || 0,
          totalSpent: dashboardData.totalSpent || 0,
          pendingOrders: dashboardData.pendingOrders || 0,
          successOrders: dashboardData.successOrders || 0,
          balance: dashboardData.balance || 0
        },
        recentOrders: dashboardData.recentOrders || [],
        recentTransactions: dashboardData.recentTransactions || [],
        lastUpdate: new Date().toISOString()
      }

      // Only update if data actually changed
      setData(prevData => {
        if (!prevData || JSON.stringify(prevData) !== JSON.stringify(formattedData)) {
          return formattedData
        }
        return prevData
      })
      
      setLastUpdate(formattedData.lastUpdate)
      setIsOnline(true)

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return // Request was cancelled, ignore
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard data'
      setError(errorMessage)
      setIsOnline(false)

      // Only show toast on first error
      if (!data) {
        toast(createToast.error('Failed to load dashboard', {
          description: errorMessage
        }))
      }
    } finally {
      setLoading(false)
    }
  }, [lastUpdate, data, toast])

  // Optimized real-time updates with smart diffing
  const checkForUpdates = useCallback(async () => {
    if (!lastUpdate) return

    try {
      const response = await fetch('/api/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ lastUpdate })
      })

      if (!response.ok) return

      const updateData = await response.json()
      
      if (updateData.hasUpdates && updateData.updates) {
        // Use React's batch updates for performance
        setData(prevData => {
          if (!prevData) return null

          const newData = { ...prevData }
          let hasChanges = false
          
          // Batch balance updates
          if (updateData.updates.balance !== undefined && updateData.updates.balance !== prevData.stats.balance) {
            newData.stats = { ...newData.stats, balance: updateData.updates.balance }
            hasChanges = true
            
            // Throttle balance change notifications
            setTimeout(() => {
              onBalanceChange?.(updateData.updates.balance)
            }, 100)
          }

          // Efficiently merge orders without full re-render
          if (updateData.updates.orders?.length > 0) {
            const existingOrderIds = new Set(prevData.recentOrders.map(o => o.id))
            const newOrders = updateData.updates.orders.filter((order: RecentOrder) => !existingOrderIds.has(order.id))
            
            if (newOrders.length > 0) {
              newData.recentOrders = [...newOrders, ...prevData.recentOrders].slice(0, 5)
              hasChanges = true
              
              // Batch order notifications
              requestAnimationFrame(() => {
                newOrders.forEach((order: RecentOrder) => {
                  onOrderUpdate?.(order)
                  
                  if (order.status === 'SUCCESS') {
                    toast(createToast.success('Order Completed!', {
                      description: `${order.service} processed successfully.`
                    }))
                  } else if (order.status === 'FAILED') {
                    toast(createToast.error('Order Failed', {
                      description: `${order.service} failed. Please try again.`
                    }))
                  }
                })
              })
            }
          }

          // Efficiently merge transactions
          if (updateData.updates.transactions?.length > 0) {
            const existingTxIds = new Set(prevData.recentTransactions.map(t => t.id))
            const newTransactions = updateData.updates.transactions.filter((tx: RecentTransaction) => !existingTxIds.has(tx.id))
            
            if (newTransactions.length > 0) {
              newData.recentTransactions = [...newTransactions, ...prevData.recentTransactions].slice(0, 10)
              hasChanges = true
            }
          }

          // Batch stats updates for smooth animations
          if (updateData.updates.orders?.length > 0) {
            const successCount = updateData.updates.orders.filter((o: RecentOrder) => o.status === 'SUCCESS').length
            const pendingCount = updateData.updates.orders.filter((o: RecentOrder) => ['PENDING', 'WAITING_PAYMENT', 'PROCESSING'].includes(o.status)).length
            
            newData.stats = {
              ...newData.stats,
              successOrders: newData.stats.successOrders + successCount,
              totalOrders: newData.stats.totalOrders + updateData.updates.orders.length,
              pendingOrders: newData.stats.pendingOrders + pendingCount
            }
            hasChanges = true
          }

          if (hasChanges) {
            newData.lastUpdate = updateData.lastUpdate
          }
          
          return hasChanges ? newData : prevData
        })

        setLastUpdate(updateData.lastUpdate)
        setIsOnline(true)
      }
    } catch (err) {
      console.warn('Failed to check for updates:', err)
      setIsOnline(false)
    }
  }, [lastUpdate, onBalanceChange, onOrderUpdate, toast])

  // Optimized polling with exponential backoff
  useEffect(() => {
    if (!enableRealtime || !data) return

    let attempts = 0
    const maxAttempts = 3
    
    const poll = () => {
      checkForUpdates().catch(() => {
        attempts++
        if (attempts < maxAttempts) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempts), 30000)
          setTimeout(poll, delay)
        }
      }).finally(() => {
        if (attempts < maxAttempts) {
          pollingRef.current = setTimeout(poll, debouncedPollingInterval)
        }
      })
    }

    pollingRef.current = setTimeout(poll, debouncedPollingInterval)

    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current)
      }
    }
  }, [enableRealtime, data, debouncedPollingInterval, checkForUpdates])

  // Network status optimization
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (data && !loading) {
        // Gentle refresh when back online
        setTimeout(() => fetchDashboardData(false), 500)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      // Clear polling when offline
      if (pollingRef.current) {
        clearTimeout(pollingRef.current)
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [fetchDashboardData, data, loading])

  // Initial fetch with retry logic
  useEffect(() => {
    let retryCount = 0
    const maxRetries = 3
    
    const initialFetch = async () => {
      try {
        await fetchDashboardData()
      } catch (error) {
        retryCount++
        if (retryCount < maxRetries) {
          const delay = Math.min(1000 * retryCount, 5000)
          setTimeout(initialFetch, delay)
        }
      }
    }

    initialFetch()
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (pollingRef.current) {
        clearTimeout(pollingRef.current)
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

// Highly optimized animated stats with RAF
export function useAnimatedStats(stats: DashboardStats | null) {
  const [displayStats, setDisplayStats] = useState(stats)
  const [animatingFields, setAnimatingFields] = useState<Set<keyof DashboardStats>>(new Set())
  const rafRef = useRef<number | undefined>(undefined)

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

    // Use RAF for 60fps animations
    const startTime = performance.now()
    const duration = 800 // Shorter duration for snappier feel
    const startValues = { ...displayStats }

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Use easeOutQuart for snappier animations
      const easedProgress = 1 - Math.pow(1 - progress, 4)
      
      const newDisplayStats = { ...startValues }
      
      fieldsToAnimate.forEach(field => {
        const startValue = startValues[field]
        const endValue = stats[field]
        const currentValue = startValue + (endValue - startValue) * easedProgress
        
        newDisplayStats[field] = Math.round(currentValue)
      })

      setDisplayStats(newDisplayStats)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatingFields(new Set())
        setDisplayStats(stats)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [stats, displayStats])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return {
    stats: displayStats,
    animatingFields
  }
}
