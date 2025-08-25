'use client'

import * as React from 'react'
import { 
  RefreshCw, 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingUp,
  Clock,
  Download,
  Upload
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface SyncResult {
  success: boolean
  message: string
  data?: {
    servicesAdded: number
    servicesUpdated: number
    productsAdded: number
    productsUpdated: number
    stockUpdated: number
  }
  error?: string
}

interface SyncStats {
  totalServices: number
  totalProducts: number
  totalStock: number
  lastSyncTime: string | null
  pendingSync: number
}

function AdminCatalogPage() {
  const { toast } = useToast()
  const [syncResults, setSyncResults] = React.useState<{
    services?: SyncResult
    products?: SyncResult
    stock?: SyncResult
    full?: SyncResult
  }>({})
  const [loading, setLoading] = React.useState<{
    services: boolean
    products: boolean
    stock: boolean
    full: boolean
  }>({
    services: false,
    products: false,
    stock: false,
    full: false
  })
  
  const [stats, setStats] = React.useState<SyncStats>({
    totalServices: 0,
    totalProducts: 0,
    totalStock: 0,
    lastSyncTime: null,
    pendingSync: 0
  })

  // Load initial stats
  React.useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Mock stats for now - you can implement real API later
      setStats({
        totalServices: 150,
        totalProducts: 850,
        totalStock: 750,
        lastSyncTime: new Date().toISOString(),
        pendingSync: 25
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleSync = async (action: 'sync-services' | 'sync-products' | 'sync-stock' | 'full-sync') => {
    const loadingKey = action.replace('sync-', '').replace('-sync', '') as keyof typeof loading
    setLoading(prev => ({ ...prev, [loadingKey]: true }))

    try {
      const response = await fetch('/api/admin/vip-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })

      const result = await response.json()
      
      if (result.success) {
        setSyncResults(prev => ({ ...prev, [loadingKey]: result }))
        toast({
          title: 'Sync Berhasil',
          description: result.message,
          variant: 'default'
        })
        loadStats() // Refresh stats
      } else {
        toast({
          title: 'Sync Gagal',
          description: result.message || 'Terjadi kesalahan saat sync',
          variant: 'destructive'
        })
        setSyncResults(prev => ({ ...prev, [loadingKey]: result }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast({
        title: 'Error',
        description: `Gagal melakukan sync: ${errorMessage}`,
        variant: 'destructive'
      })
      setSyncResults(prev => ({ ...prev, [loadingKey]: { success: false, message: errorMessage } }))
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }))
    }
  }

  const SyncButton = ({ 
    action, 
    title, 
    description, 
    icon: Icon,
    variant = 'default'
  }: {
    action: 'sync-services' | 'sync-products' | 'sync-stock' | 'full-sync'
    title: string
    description: string
    icon: React.ElementType
    variant?: 'default' | 'primary'
  }) => {
    const loadingKey = action.replace('sync-', '').replace('-sync', '') as keyof typeof loading
    const isLoading = loading[loadingKey]
    const result = syncResults[loadingKey]

    return (
      <GlassCard className="p-6" variant="cyber" hover glow>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div className={`p-3 rounded-lg ${
              variant === 'primary' 
                ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan shadow-glow-cyan' 
                : 'bg-white/10'
            }`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 font-mono">{title}</h3>
              <p className="text-white/70 text-sm mb-4">{description}</p>
              
              {/* Sync Result */}
              {result && (
                <div className={`flex items-center space-x-2 text-sm mb-3 ${
                  result.success ? 'text-neon-green' : 'text-red-400'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <span className="font-mono">{result.message}</span>
                </div>
              )}

              {/* Sync Data Details */}
              {result?.success && result.data && (
                <div className="grid grid-cols-2 gap-2 text-xs text-neon-cyan mb-3 font-mono">
                  {result.data.servicesAdded > 0 && (
                    <div>+ {result.data.servicesAdded} services</div>
                  )}
                  {result.data.servicesUpdated > 0 && (
                    <div>~ {result.data.servicesUpdated} updated</div>
                  )}
                  {result.data.productsAdded > 0 && (
                    <div>+ {result.data.productsAdded} products</div>
                  )}
                  {result.data.productsUpdated > 0 && (
                    <div>~ {result.data.productsUpdated} updated</div>
                  )}
                  {result.data.stockUpdated > 0 && (
                    <div>@ {result.data.stockUpdated} stock sync</div>
                  )}
                </div>
              )}
              
              <Button 
                onClick={() => handleSync(action)}
                disabled={isLoading}
                variant={variant === 'primary' ? 'default' : 'outline'}
                className={`w-full font-mono tracking-wide ${
                  variant === 'primary' 
                    ? 'bg-gradient-to-r from-neon-magenta to-neon-cyan hover:opacity-90 shadow-glow-cyan' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    SYNCING...
                  </>
                ) : (
                  <>
                    <Icon className="h-4 w-4 mr-2" />
                    {title.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header with retro styling */}
        <div className="mb-8 relative">
          <div className="flex items-center space-x-4 mb-4">
            <h1 className="text-4xl font-heading font-bold text-transparent bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-purple bg-clip-text animate-pulse">
              VIP-RESELLER CATALOG
            </h1>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
              <div className="w-2 h-2 bg-neon-cyan rounded-full animate-ping" style={{animationDelay: '0.2s'}} />
              <div className="w-2 h-2 bg-neon-magenta rounded-full animate-ping" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
          <p className="text-white/70 font-mono text-sm tracking-wide">
            {">"} Sync dan kelola data produk dari VIP-Reseller API
          </p>
          <div className="neon-divider mt-4" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6" variant="cyber" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neon-cyan uppercase tracking-wider">SERVICES.DB</p>
                <p className="text-3xl font-bold text-white font-mono">{stats.totalServices}</p>
                <p className="text-xs text-neon-green flex items-center font-mono">
                  <span className="mr-1">▲</span> ACTIVE_SERVICES
                </p>
              </div>
              <Package className="h-8 w-8 text-neon-cyan" />
            </div>
            <div className="absolute bottom-2 right-2">
              <div className="text-xs text-white/40 font-mono">[01]</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="cyber" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-neon-magenta uppercase tracking-wider">PRODUCTS.DB</p>
                <p className="text-3xl font-bold text-white font-mono">{stats.totalProducts}</p>
                <p className="text-xs text-neon-green flex items-center font-mono">
                  <span className="mr-1">▲</span> CATALOG_SIZE
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-neon-magenta" />
            </div>
            <div className="absolute bottom-2 right-2">
              <div className="text-xs text-white/40 font-mono">[02]</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="cyber" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-green-400 uppercase tracking-wider">STOCK.SYS</p>
                <p className="text-3xl font-bold text-white font-mono">{stats.totalStock}</p>
                <p className="text-xs text-neon-green flex items-center font-mono">
                  <span className="mr-1">▲</span> IN_STOCK
                </p>
              </div>
              <Database className="h-8 w-8 text-green-400" />
            </div>
            <div className="absolute bottom-2 right-2">
              <div className="text-xs text-white/40 font-mono">[03]</div>
            </div>
          </GlassCard>

          <GlassCard className="p-6" variant="cyber" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-yellow-400 uppercase tracking-wider">SYNC_QUEUE</p>
                <p className="text-3xl font-bold text-white font-mono">{stats.pendingSync}</p>
                <p className="text-xs text-yellow-400 flex items-center font-mono">
                  <span className="mr-1">!</span> PENDING
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
            <div className="absolute bottom-2 right-2">
              <div className="text-xs text-white/40 font-mono">[04]</div>
            </div>
          </GlassCard>
        </div>

        {/* Last Sync Info */}
        {stats.lastSyncTime && (
          <GlassCard className="p-4" variant="cyber">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-neon-green" />
              <span className="text-white/70 font-mono">
                LAST_SYNC: {new Date(stats.lastSyncTime).toLocaleString('id-ID')}
              </span>
            </div>
          </GlassCard>
        )}

        {/* Sync Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Full Sync - Highlighted */}
          <div className="lg:col-span-2">
            <SyncButton
              action="full-sync"
              title="FULL SYNC"
              description="Sync semua data: Services, Products, dan Stock dari VIP-Reseller sekaligus"
              icon={RefreshCw}
              variant="primary"
            />
          </div>

          {/* Individual Syncs */}
          <SyncButton
            action="sync-services"
            title="SYNC SERVICES"
            description="Import layanan game, prepaid, dan social media dari VIP-Reseller"
            icon={Package}
          />

          <SyncButton
            action="sync-products"
            title="SYNC PRODUCTS"
            description="Import produk dengan harga dari semua layanan VIP-Reseller"
            icon={ShoppingCart}
          />

          <div className="lg:col-span-2">
            <SyncButton
              action="sync-stock"
              title="SYNC STOCK"
              description="Update informasi stock untuk semua produk dari VIP-Reseller"
              icon={Database}
            />
          </div>
        </div>

        {/* API Status */}
        <GlassCard className="p-6" variant="cyber">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center font-mono">
            <TrendingUp className="h-5 w-5 mr-2" />
            API_STATUS.SYS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-white/70 font-mono">PROFILE.API</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-white/70 font-mono">GAME_FEATURE.API</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-white/70 font-mono">PREPAID.API</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
              <span className="text-white/70 font-mono">SOCIAL_MEDIA.API</span>
            </div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="p-6" variant="cyber">
          <h3 className="text-lg font-semibold text-white mb-4 font-mono">QUICK_ACTIONS.EXE</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => window.open('/admin/services', '_blank')}
              className="w-full border-white/20 text-white hover:bg-white/10 font-mono"
            >
              <Package className="h-4 w-4 mr-2" />
              VIEW_PRODUCTS
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/admin/stock', '_blank')}
              className="w-full border-white/20 text-white hover:bg-white/10 font-mono"
            >
              <Database className="h-4 w-4 mr-2" />
              MANAGE_STOCK
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/admin/orders', '_blank')}
              className="w-full border-white/20 text-white hover:bg-white/10 font-mono"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              VIEW_ORDERS
            </Button>
          </div>
        </GlassCard>

        {/* Instructions */}
        <GlassCard className="p-6" variant="cyber">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center font-mono">
            <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
            USAGE_MANUAL.TXT
          </h3>
          <div className="space-y-3 text-white/70 text-sm font-mono">
            <div className="flex items-start space-x-3">
              <span className="bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded text-xs">STEP_01</span>
              <p><strong>FULL_SYNC:</strong> Gunakan untuk setup awal atau sync besar-besaran</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-neon-magenta/20 text-neon-magenta px-2 py-1 rounded text-xs">STEP_02</span>
              <p><strong>SYNC_SERVICES:</strong> Import layanan baru dari Game, Prepaid, dan Social Media</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-green-400/20 text-green-400 px-2 py-1 rounded text-xs">STEP_03</span>
              <p><strong>SYNC_PRODUCTS:</strong> Update produk dan harga terbaru</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded text-xs">STEP_04</span>
              <p><strong>SYNC_STOCK:</strong> Update ketersediaan stock produk</p>
            </div>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  )
}

export default AdminCatalogPage
