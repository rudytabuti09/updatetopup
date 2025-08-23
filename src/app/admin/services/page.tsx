'use client'

import * as React from 'react'
import { 
  Package, 
  Search, 
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Settings,
  Grid,
  List,
  Tag,
  DollarSign,
  BarChart3,
  Activity,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  _count: {
    services: number
  }
}

interface Service {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  logo?: string
  provider: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  category: {
    name: string
  }
  _count: {
    products: number
    orders: number
  }
}

interface Product {
  id: string
  serviceId: string
  name: string
  description?: string
  price: number
  buyPrice: number
  profit: number
  sku: string
  category: string
  isActive: boolean
  stock?: number
  stockType: 'LIMITED' | 'UNLIMITED' | 'OUT_OF_STOCK'
  createdAt: string
  service: {
    name: string
    category: {
      name: string
    }
  }
}

interface ServiceStats {
  totalCategories: number
  totalServices: number
  totalProducts: number
  activeProducts: number
  totalRevenue: number
  topCategory: string
}

export default function AdminServicesPage() {
  const { toast } = useToast()
  const [categories, setCategories] = React.useState<Category[]>([])
  const [services, setServices] = React.useState<Service[]>([])
  const [products, setProducts] = React.useState<Product[]>([])
  const [stats, setStats] = React.useState<ServiceStats>({
    totalCategories: 0,
    totalServices: 0,
    totalProducts: 0,
    activeProducts: 0,
    totalRevenue: 0,
    topCategory: 'N/A'
  })
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [categoryFilter, setCategoryFilter] = React.useState('all')

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true)
      const [categoriesRes, servicesRes, productsRes, statsRes] = await Promise.all([
        fetch('/api/admin/services/categories'),
        fetch('/api/admin/services'),
        fetch('/api/admin/services/products'),
        fetch('/api/admin/services/stats')
      ])

      const [categoriesResult, servicesResult, productsResult, statsResult] = await Promise.all([
        categoriesRes.json(),
        servicesRes.json(),
        productsRes.json(),
        statsRes.json()
      ])

      if (categoriesResult.success) setCategories(categoriesResult.data.categories)
      if (servicesResult.success) setServices(servicesResult.data.services)
      if (productsResult.success) setProducts(productsResult.data.products)
      if (statsResult.success) setStats(statsResult.data)

    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleToggleStatus = async (type: 'category' | 'service' | 'product', id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${type}/${id}/toggle`, {
        method: 'PATCH'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message
        })
        fetchData()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      })
    }
  }

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString))
  }

  const getStockBadge = (stockType: string, stock?: number) => {
    switch (stockType) {
      case 'UNLIMITED':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Unlimited</Badge>
      case 'OUT_OF_STOCK':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Out of Stock</Badge>
      case 'LIMITED':
        const isLow = stock !== undefined && stock < 10
        return (
          <Badge className={isLow ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"}>
            {stock} Stock
          </Badge>
        )
      default:
        return <Badge>Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat data produk & layanan...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Produk & Layanan
        </h1>
        <p className="text-white/70">
          Kelola kategori, layanan, dan produk platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <Grid className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Categories</p>
              <p className="text-xl font-bold text-white">{stats.totalCategories}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Services</p>
              <p className="text-xl font-bold text-white">{stats.totalServices}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Products</p>
              <p className="text-xl font-bold text-white">{stats.totalProducts}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-center mr-3">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Active Products</p>
              <p className="text-xl font-bold text-white">{stats.activeProducts}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Revenue</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Top Category</p>
              <p className="text-lg font-bold text-white">{stats.topCategory}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Produk</TabsTrigger>
          <TabsTrigger value="services">Layanan</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Filters */}
          <GlassCard>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                <Input
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                   product.service.name.toLowerCase().includes(searchTerm.toLowerCase())
                const matchesStatus = statusFilter === 'all' || 
                                     (statusFilter === 'active' && product.isActive) ||
                                     (statusFilter === 'inactive' && !product.isActive)
                return matchesSearch && matchesStatus
              })
              .map((product) => (
                <GlassCard key={product.id}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                        {getStockBadge(product.stockType, product.stock)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleToggleStatus('product', product.id)}
                          >
                            <Activity className="h-4 w-4 mr-2" />
                            {product.isActive ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <h3 className="font-medium text-white">{product.name}</h3>
                      <p className="text-sm text-white/60">{product.service.name}</p>
                      <p className="text-xs text-white/40">{product.service.category.name}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Harga:</span>
                        <span className="text-white font-medium">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Profit:</span>
                        <span className="text-green-400 font-medium">{formatCurrency(product.profit)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">SKU:</span>
                        <span className="text-white/80 font-mono text-xs">{product.sku}</span>
                      </div>
                    </div>

                    <div className="text-xs text-white/40">
                      Dibuat: {formatDate(product.createdAt)}
                    </div>
                  </div>
                </GlassCard>
              ))
            }
          </div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                <Input
                  placeholder="Cari layanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Layanan
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Layanan</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Kategori</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Provider</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Products</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Orders</th>
                    <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                    <th className="text-right py-3 px-4 text-white/70 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services
                    .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((service) => (
                      <tr key={service.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-white">{service.name}</div>
                            <div className="text-sm text-white/60">{service.slug}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-white/70">
                          {service.category.name}
                        </td>
                        <td className="py-4 px-4 text-white/70 font-mono text-sm">
                          {service.provider}
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          {service._count.products}
                        </td>
                        <td className="py-4 px-4 text-white font-medium">
                          {service._count.orders}
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={service.isActive ? "default" : "secondary"}>
                            {service.isActive ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Service
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleToggleStatus('service', service.id)}
                              >
                                <Activity className="h-4 w-4 mr-2" />
                                {service.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </GlassCard>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                <Input
                  placeholder="Cari kategori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button className="ml-4">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kategori
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter(category => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((category) => (
                  <GlassCard key={category.id}>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant={category.isActive ? "default" : "secondary"}>
                          {category.isActive ? 'Aktif' : 'Tidak Aktif'}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Category
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleToggleStatus('category', category.id)}
                            >
                              <Activity className="h-4 w-4 mr-2" />
                              {category.isActive ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <h3 className="font-medium text-white">{category.name}</h3>
                        <p className="text-sm text-white/60">{category.slug}</p>
                        {category.description && (
                          <p className="text-xs text-white/40 mt-1">{category.description}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-white/40" />
                          <span className="text-white/60">{category._count.services} Layanan</span>
                        </div>
                        <div className="text-white/40">
                          Order: {category.sortOrder}
                        </div>
                      </div>

                      <div className="text-xs text-white/40">
                        Dibuat: {formatDate(category.createdAt)}
                      </div>
                    </div>
                  </GlassCard>
                ))
              }
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  )
}
