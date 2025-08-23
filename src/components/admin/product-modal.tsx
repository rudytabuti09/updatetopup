'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { X } from 'lucide-react'

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

interface ProductModalProps {
  product?: Product
  categories: Category[]
  onClose: () => void
  onSuccess: () => void
}

export function ProductModal({ product, categories, onClose, onSuccess }: ProductModalProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(product?.service.category.id || '')
  const [availableServices, setAvailableServices] = useState<Service[]>([])

  // Form state
  const [formData, setFormData] = useState({
    serviceId: product?.service.id || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    buyPrice: product?.buyPrice.toString() || '',
    sku: product?.sku || '',
    category: product?.category || '',
    stockType: product?.stockType || 'UNLIMITED',
    stock: product?.stock?.toString() || '',
    minStock: product?.minStock?.toString() || '',
    maxStock: product?.maxStock?.toString() || '',
    isActive: product?.isActive ?? true,
    sortOrder: product?.sortOrder.toString() || '0'
  })

  // Update available services when category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find(c => c.id === selectedCategoryId)
      setAvailableServices(category?.services || [])
      
      // Clear service selection if changing category
      if (selectedCategoryId !== product?.service.category.id) {
        setFormData(prev => ({ ...prev, serviceId: '' }))
      }
    } else {
      setAvailableServices([])
    }
  }, [selectedCategoryId, categories, product])

  // Auto-generate SKU from service and name
  const generateSKU = () => {
    if (formData.serviceId && formData.name) {
      const service = availableServices.find(s => s.id === formData.serviceId)
      if (service) {
        const serviceName = service.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()
        const productName = formData.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase()
        const timestamp = Date.now().toString().slice(-4)
        const generatedSKU = `${serviceName}${productName}${timestamp}`
        setFormData(prev => ({ ...prev, sku: generatedSKU }))
      }
    }
  }

  // Calculate profit when prices change
  const calculateProfit = (price: string, buyPrice: string) => {
    const priceNum = parseFloat(price) || 0
    const buyPriceNum = parseFloat(buyPrice) || 0
    return priceNum - buyPriceNum
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Auto-calculate profit when price or buyPrice changes
      if (field === 'price' || field === 'buyPrice') {
        const profit = calculateProfit(
          field === 'price' ? value as string : prev.price,
          field === 'buyPrice' ? value as string : prev.buyPrice
        )
        console.log('Profit calculated:', profit)
      }
      
      return updated
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (!formData.serviceId || !formData.name || !formData.price || !formData.buyPrice || !formData.sku) {
        toast({
          title: 'Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        })
        return
      }

      const price = parseFloat(formData.price)
      const buyPrice = parseFloat(formData.buyPrice)

      if (price <= buyPrice) {
        toast({
          title: 'Error',
          description: 'Selling price must be higher than buy price',
          variant: 'destructive'
        })
        return
      }

      // Prepare data for API
      const apiData: Record<string, unknown> = {
        ...formData,
        price: price,
        buyPrice: buyPrice,
        stock: formData.stockType === 'LIMITED' ? parseInt(formData.stock) || 0 : null,
        minStock: formData.minStock ? parseInt(formData.minStock) : null,
        maxStock: formData.maxStock ? parseInt(formData.maxStock) : null,
        sortOrder: parseInt(formData.sortOrder) || 0
      }

      // Add product ID if editing
      if (product) {
        apiData.id = product.id
      }

      const url = '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(apiData)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'Success',
          description: product ? 'Product updated successfully' : 'Product created successfully'
        })
        onSuccess()
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
        description: 'Failed to save product',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const currentProfit = calculateProfit(formData.price, formData.buyPrice)

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category and Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="service">Service *</Label>
                <Select 
                  value={formData.serviceId} 
                  onValueChange={(value) => handleInputChange('serviceId', value)}
                  disabled={!selectedCategoryId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., 1000 Diamonds"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Product SKU"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSKU}
                      disabled={!formData.serviceId || !formData.name}
                    >
                      Generate
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category-field">Category Tag</Label>
                  <Input
                    id="category-field"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Mobile Legends"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="buyPrice">Buy Price (Rp) *</Label>
                <Input
                  id="buyPrice"
                  type="number"
                  value={formData.buyPrice}
                  onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div>
                <Label htmlFor="price">Sell Price (Rp) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="100"
                  required
                />
              </div>

              <div>
                <Label>Profit (Rp)</Label>
                <div className={`mt-2 p-2 border rounded font-medium ${currentProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {currentProfit.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="stockType">Stock Type</Label>
                <Select 
                  value={formData.stockType} 
                  onValueChange={(value) => handleInputChange('stockType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNLIMITED">Unlimited</SelectItem>
                    <SelectItem value="LIMITED">Limited</SelectItem>
                    <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.stockType === 'LIMITED' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="stock">Current Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minStock">Min Stock Alert</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', e.target.value)}
                      placeholder="10"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => handleInputChange('maxStock', e.target.value)}
                      placeholder="1000"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive">Active Product</Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-6">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
