'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { ProductModal } from '@/components/admin/product-modal'
import { 
  RefreshCw, 
  Download, 
  Upload, 
  AlertTriangle, 
  Package,
  TrendingUp,
  Search,
  Filter,
  Edit,
  Eye,
  BarChart3
} from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  buyPrice: number
  profit: number
  stock: number | null
  stockType: 'LIMITED' | 'UNLIMITED' | 'OUT_OF_STOCK'
  minStock: number | null
  maxStock: number | null
  isActive: boolean
  lastStockSync: string | null
  description?: string
  category: string
  sortOrder: number
  service: {
    id: string
    name: string
    category: {
      id: string
      name: string
    }
  }
}

interface Category {
  id: string
  name: string
  services?: Service[]
}

interface Service {
  id: string
  name: string
  categoryId: string
}

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

export default function AdminCatalogPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadProducts()
    loadLowStockProducts()
    loadCategories()
  }, [])

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.service.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Stock filter
    switch (stockFilter) {
      case 'limited':
        filtered = filtered.filter(p => p.stockType === 'LIMITED')
        break
      case 'unlimited':
        filtered = filtered.filter(p => p.stockType === 'UNLIMITED')
        break
      case 'out_of_stock':
        filtered = filtered.filter(p => p.stockType === 'OUT_OF_STOCK')
        break
      case 'low_stock':
        filtered = filtered.filter(p => 
          p.stockType === 'LIMITED' && 
          p.minStock && 
          p.stock !== null && 
          p.stock <= p.minStock
        )
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, stockFilter])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/products?limit=100')
      const result = await response.json()
      
      if (result.success) {
        setProducts(result.data.products)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories?includeServices=true')
      const result = await response.json()
      
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
    }
  }

  const loadLowStockProducts = async () => {
    try {
      const response = await fetch('/api/admin/stock?action=low-stock')
      const result = await response.json()
      
      if (result.success) {
        setLowStockProducts(result.data)
      }
    } catch (error) {
      console.error('Failed to load low stock products:', error)
    }
  }

  const handleSync = async (action: string) => {
    try {
      setSyncing(true)
      const response = await fetch('/api/admin/vip-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
      
      const result: SyncResult = await response.json()
      
      if (result.success) {
        toast({
          title: 'Sync Successful',
          description: result.message
        })
        
        // Reload products if sync affected them
        if (action === 'sync-products' || action === 'sync-stock' || action === 'full-sync') {
          await loadProducts()
          await loadLowStockProducts()
        }
      } else {
        toast({
          title: 'Sync Failed',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with VIP-Reseller',
        variant: 'destructive'
      })
    } finally {
      setSyncing(false)
    }
  }

  const updateProductStock = async (productId: string, stock: number, reason: string) => {
    try {
      const response = await fetch('/api/admin/stock', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          stock,
          reason
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Stock updated successfully'
        })
        await loadProducts()
        await loadLowStockProducts()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update stock',
        variant: 'destructive'
      })
    }
  }

  const getStockBadgeVariant = (stockType: string, stock: number | null, minStock: number | null) => {
    if (stockType === 'OUT_OF_STOCK') return 'destructive'
    if (stockType === 'UNLIMITED') return 'secondary'
    if (minStock && stock !== null && stock <= minStock) return 'destructive'
    return 'default'
  }

  const getStockText = (product: Product) => {
    if (product.stockType === 'UNLIMITED') return 'Unlimited'
    if (product.stockType === 'OUT_OF_STOCK') return 'Out of Stock'
    return product.stock?.toString() || '0'
  }

  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p>Access denied. Admin privileges required.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Catalog Management</h1>
          <p className="text-muted-foreground">
            Manage products, stock, and sync with VIP-Reseller
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Package className="w-4 h-4 mr-2" />
            Tambah Produk
          </Button>
          
          <Button
            onClick={() => handleSync('sync-stock')}
            disabled={syncing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            Sync Stock
          </Button>
          
          <Button
            onClick={() => handleSync('full-sync')}
            disabled={syncing}
          >
            <Download className="w-4 h-4 mr-2" />
            Full Sync
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockProducts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
              Active Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Avg. Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {products.length > 0 
                ? `${Math.round(products.reduce((acc, p) => acc + p.profit, 0) / products.length)}%`
                : '0%'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="sync">VIP-Reseller Sync</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="all">All Products</option>
              <option value="limited">Limited Stock</option>
              <option value="unlimited">Unlimited</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="low_stock">Low Stock</option>
            </select>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({filteredProducts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading products...</div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {product.service.category.name} • {product.service.name}
                          </p>
                          <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={product.isActive ? 'default' : 'secondary'}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          
                          <Badge variant={getStockBadgeVariant(product.stockType, product.stock, product.minStock)}>
                            {getStockText(product)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex gap-4 text-sm">
                          <span>Price: Rp {product.price.toLocaleString()}</span>
                          <span>Buy: Rp {product.buyPrice.toLocaleString()}</span>
                          <span>Profit: Rp {product.profit.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product)
                              setShowEditModal(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProduct(product)}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            Stock
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No products found matching your criteria.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>VIP-Reseller Synchronization</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sync services, products, and stock data with VIP-Reseller API
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleSync('sync-services')}
                  disabled={syncing}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Download className="w-6 h-6 mb-2" />
                  Sync Services
                  <span className="text-xs text-muted-foreground">Update service list</span>
                </Button>
                
                <Button
                  onClick={() => handleSync('sync-products')}
                  disabled={syncing}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Package className="w-6 h-6 mb-2" />
                  Sync Products
                  <span className="text-xs text-muted-foreground">Update price list</span>
                </Button>
                
                <Button
                  onClick={() => handleSync('sync-stock')}
                  disabled={syncing}
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <RefreshCw className="w-6 h-6 mb-2" />
                  Sync Stock
                  <span className="text-xs text-muted-foreground">Update stock levels</span>
                </Button>
                
                <Button
                  onClick={() => handleSync('full-sync')}
                  disabled={syncing}
                  className="h-20 flex flex-col items-center justify-center"
                >
                  <Upload className="w-6 h-6 mb-2" />
                  Full Sync
                  <span className="text-xs text-muted-foreground">Sync everything</span>
                </Button>
              </div>
              
              {syncing && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Synchronizing with VIP-Reseller...</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                Low Stock Alerts ({lowStockProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No low stock alerts. All products are well stocked!
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg bg-destructive/5">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current: {product.stock} • Min: {product.minStock}
                        </p>
                      </div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Product Modal */}
      {showAddModal && (
        <ProductModal
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            loadProducts()
          }}
        />
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => {
            setShowEditModal(false)
            setSelectedProduct(null)
          }}
          onSuccess={() => {
            setShowEditModal(false)
            setSelectedProduct(null)
            loadProducts()
          }}
        />
      )}

      {/* Edit Stock Modal */}
      {selectedProduct && !showEditModal && (
        <StockEditModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProductStock}
        />
      )}
    </div>
  )
}

// Stock Edit Modal Component
interface StockEditModalProps {
  product: Product
  onClose: () => void
  onUpdate: (productId: string, stock: number, reason: string) => void
}

function StockEditModal({ product, onClose, onUpdate }: StockEditModalProps) {
  const [stock, setStock] = useState(product.stock?.toString() || '0')
  const [reason, setReason] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const stockNumber = parseInt(stock)
    if (!isNaN(stockNumber) && reason.trim()) {
      onUpdate(product.id, stockNumber, reason.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit Stock: {product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Current Stock: {product.stock || 0}</label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                min="0"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Reason for Change</label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Manual restock, Correction, etc."
                required
                className="mt-1"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">Update Stock</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
