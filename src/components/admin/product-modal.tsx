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
  const [currentStep, setCurrentStep] = useState(1)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [isDirty, setIsDirty] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false)
  
  // Form state - define this BEFORE the useEffects that depend on it
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
  
  // Real-time validation
  const validateField = (field: string, value: string | boolean) => {
    const errors: Record<string, string> = {}
    
    switch (field) {
      case 'name':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          errors.name = 'Product name must be at least 3 characters'
        }
        break
      case 'price':
      case 'buyPrice':
        if (!value || parseFloat(value as string) <= 0) {
          errors[field] = 'Price must be greater than 0'
        }
        break
      case 'sku':
        if (!value || (typeof value === 'string' && value.trim().length < 3)) {
          errors.sku = 'SKU must be at least 3 characters'
        }
        break
    }
    
    setFormErrors(prev => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }
  
  // Auto-save draft functionality
  useEffect(() => {
    if (isDirty && autoSaveEnabled) {
      const timer = setTimeout(() => {
        localStorage.setItem('product-draft', JSON.stringify(formData))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [formData, isDirty, autoSaveEnabled])
  
  // Load draft on mount
  useEffect(() => {
    if (!product) {
      const draft = localStorage.getItem('product-draft')
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          setFormData(draftData)
          setAutoSaveEnabled(true)
        } catch (error) {
          localStorage.removeItem('product-draft')
        }
      }
    }
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            // Create a synthetic form event for handleSubmit
            const syntheticEvent = new Event('submit', { bubbles: true, cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
            handleSubmit(syntheticEvent)
            break
          case 'Escape':
            e.preventDefault()
            onClose()
            break
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [formData])

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
    setIsDirty(true)
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      
      // Real-time validation
      validateField(field, value)
      
      // Auto-calculate profit when price or buyPrice changes
      if (field === 'price' || field === 'buyPrice') {
        const profit = calculateProfit(
          field === 'price' ? value as string : prev.price,
          field === 'buyPrice' ? value as string : prev.buyPrice
        )
        
        // Smart suggestions for pricing
        if (field === 'buyPrice' && value) {
          const buyPriceNum = parseFloat(value as string)
          if (buyPriceNum > 0 && !updated.price) {
            // Suggest a 20% markup
            const suggestedPrice = Math.round(buyPriceNum * 1.2 / 100) * 100
            updated.price = suggestedPrice.toString()
          }
        }
      }
      
      // Smart category tag suggestion
      if (field === 'serviceId' && value) {
        const service = availableServices.find(s => s.id === value)
        const category = categories.find(c => c.id === selectedCategoryId)
        if (service && category && !updated.category) {
          updated.category = `${category.name} - ${service.name}`
        }
      }
      
      return updated
    })
  }
  
  // Calculate form completion percentage
  const getFormCompletion = () => {
    const requiredFields = ['serviceId', 'name', 'sku', 'price', 'buyPrice']
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof typeof formData]
      return value && value !== ''
    })
    return Math.round((completedFields.length / requiredFields.length) * 100)
  }
  
  // Smart suggestions for common products
  const getProductSuggestions = (name: string) => {
    const suggestions = [
      { pattern: /diamond/i, suggestions: ['100 Diamonds', '500 Diamonds', '1000 Diamonds', '5000 Diamonds'] },
      { pattern: /uc|pubg/i, suggestions: ['60 UC', '300 UC', '600 UC', '1500 UC'] },
      { pattern: /cp|cod/i, suggestions: ['80 CP', '400 CP', '800 CP', '2000 CP'] },
      { pattern: /token|ff|freefire/i, suggestions: ['100 Token', '500 Token', '1000 Token', '2000 Token'] }
    ]
    
    for (const { pattern, suggestions: items } of suggestions) {
      if (pattern.test(name)) {
        return items.filter(item => item.toLowerCase().includes(name.toLowerCase()))
      }
    }
    return []
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 retro-grid opacity-5 pointer-events-none" />
      
      {/* Modal Container with enhanced styling */}
      <div className="w-full max-w-3xl max-h-[95vh] bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-cyan-900/30 border border-cyan-400/50 rounded-2xl shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Animated Border Effect */}
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/60 via-purple-400/60 to-pink-400/60 bg-clip-border p-[1px]">
            <div className="rounded-2xl bg-gradient-to-br from-gray-900/95 via-purple-900/30 to-cyan-900/30 h-full w-full" />
          </div>
        </div>
        
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
        
        {/* Header - Fixed */}
        <div className="relative z-10 border-b border-cyan-400/30 bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-75" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-mono uppercase tracking-wider">
                  {product ? '📝 EDIT_PRODUCT.SYS' : '➕ ADD_PRODUCT.SYS'}
                </h2>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-xs text-cyan-400 font-mono opacity-80">
                    {product ? 'MODIFY_EXISTING_RECORD' : 'CREATE_NEW_RECORD'} {/* WMX_ADMIN_PANEL */}
                  </p>
                  {autoSaveEnabled && (
                    <span className="text-xs text-green-400 font-mono flex items-center">
                      💾 AUTO_SAVE_ON
                    </span>
                  )}
                  {isDirty && (
                    <span className="text-xs text-yellow-400 font-mono animate-pulse">
                      ⚠️ UNSAVED_CHANGES
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-xs text-white/60 font-mono uppercase">COMPLETION</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">{getFormCompletion()}%</div>
              </div>
              <button
                onClick={onClose}
                className="group w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/20 hover:bg-red-500/40 border border-red-400/40 text-red-400 hover:text-red-300 transition-all duration-300 hover:scale-105"
              >
                <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1 bg-gray-800 relative overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500 relative"
              style={{ width: `${getFormCompletion()}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          
          {/* Keyboard shortcuts hint */}
          <div className="px-6 py-2 border-t border-cyan-400/10 bg-gray-900/50">
            <div className="flex items-center justify-between text-xs text-white/40 font-mono">
              <span>💡 SHORTCUTS: CTRL+S (Save) • ESC (Close)</span>
              <span>🎯 {5 - Math.floor(getFormCompletion() / 20)} REQUIRED FIELDS REMAINING</span>
            </div>
          </div>
        </div>
        
        {/* Content - Scrollable with custom scrollbar */}
        <div className="relative z-10 max-h-[calc(95vh-120px)] overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category and Service Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-cyan-400 font-mono text-sm uppercase tracking-wider">CATEGORY_ID *</Label>
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="bg-gray-800/50 border-cyan-400/30 text-white font-mono">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-cyan-400/30">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="text-white hover:bg-cyan-400/20">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service" className="text-purple-400 font-mono text-sm uppercase tracking-wider">SERVICE_ID *</Label>
                <Select 
                  value={formData.serviceId} 
                  onValueChange={(value) => handleInputChange('serviceId', value)}
                  disabled={!selectedCategoryId}
                >
                  <SelectTrigger className="bg-gray-800/50 border-purple-400/30 text-white font-mono disabled:opacity-50">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-purple-400/30">
                    {availableServices.map((service) => (
                      <SelectItem key={service.id} value={service.id} className="text-white hover:bg-purple-400/20">
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-green-400/20">
              <h3 className="text-green-400 font-mono text-sm uppercase tracking-wider border-b border-green-400/20 pb-2">📦 PRODUCT_DATA.CONF</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-mono text-sm uppercase tracking-wider">PRODUCT_NAME *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., 1000 Diamonds"
                  className="bg-gray-800/50 border-green-400/30 text-white font-mono placeholder-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white/80 font-mono text-sm uppercase tracking-wider">DESCRIPTION</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Optional product description"
                  className="bg-gray-800/50 border-gray-500/30 text-white font-mono placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-yellow-400 font-mono text-sm uppercase tracking-wider">PRODUCT_SKU *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Product SKU"
                      className="bg-gray-800/50 border-yellow-400/30 text-white font-mono placeholder-gray-400"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSKU}
                      disabled={!formData.serviceId || !formData.name}
                      className="border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 font-mono"
                    >
                      GEN
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category-field" className="text-white/80 font-mono text-sm uppercase tracking-wider">CATEGORY_TAG</Label>
                  <Input
                    id="category-field"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="e.g., Mobile Legends"
                    className="bg-gray-800/50 border-gray-500/30 text-white font-mono placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-orange-400/20">
              <h3 className="text-orange-400 font-mono text-sm uppercase tracking-wider border-b border-orange-400/20 pb-2">💰 PRICING_CONFIG.SYS</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buyPrice" className="text-red-400 font-mono text-sm uppercase tracking-wider">BUY_PRICE (Rp) *</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    value={formData.buyPrice}
                    onChange={(e) => handleInputChange('buyPrice', e.target.value)}
                    placeholder="0"
                    className="bg-gray-800/50 border-red-400/30 text-white font-mono placeholder-gray-400"
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-green-400 font-mono text-sm uppercase tracking-wider">SELL_PRICE (Rp) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    className="bg-gray-800/50 border-green-400/30 text-white font-mono placeholder-gray-400"
                    min="0"
                    step="100"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-cyan-400 font-mono text-sm uppercase tracking-wider">PROFIT_CALC</Label>
                  <div className={`mt-2 p-3 border rounded-lg font-mono text-center ${
                    currentProfit >= 0 
                      ? 'bg-green-500/20 border-green-400/30 text-green-400' 
                      : 'bg-red-500/20 border-red-400/30 text-red-400'
                  }`}>
                    Rp {currentProfit.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Management */}
            <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-blue-400/20">
              <h3 className="text-blue-400 font-mono text-sm uppercase tracking-wider border-b border-blue-400/20 pb-2">📊 STOCK_MANAGEMENT.DB</h3>
              
              <div className="space-y-2">
                <Label htmlFor="stockType" className="text-blue-400 font-mono text-sm uppercase tracking-wider">STOCK_TYPE</Label>
                <Select 
                  value={formData.stockType} 
                  onValueChange={(value) => handleInputChange('stockType', value)}
                >
                  <SelectTrigger className="bg-gray-800/50 border-blue-400/30 text-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-blue-400/30">
                    <SelectItem value="UNLIMITED" className="text-white hover:bg-blue-400/20">♾️ Unlimited</SelectItem>
                    <SelectItem value="LIMITED" className="text-white hover:bg-blue-400/20">📦 Limited</SelectItem>
                    <SelectItem value="OUT_OF_STOCK" className="text-white hover:bg-blue-400/20">❌ Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.stockType === 'LIMITED' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-cyan-400 font-mono text-sm uppercase tracking-wider">CURRENT_STOCK</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      placeholder="0"
                      className="bg-gray-800/50 border-cyan-400/30 text-white font-mono placeholder-gray-400"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minStock" className="text-yellow-400 font-mono text-sm uppercase tracking-wider">MIN_ALERT</Label>
                    <Input
                      id="minStock"
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => handleInputChange('minStock', e.target.value)}
                      placeholder="10"
                      className="bg-gray-800/50 border-yellow-400/30 text-white font-mono placeholder-gray-400"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxStock" className="text-purple-400 font-mono text-sm uppercase tracking-wider">MAX_STOCK</Label>
                    <Input
                      id="maxStock"
                      type="number"
                      value={formData.maxStock}
                      onChange={(e) => handleInputChange('maxStock', e.target.value)}
                      placeholder="1000"
                      className="bg-gray-800/50 border-purple-400/30 text-white font-mono placeholder-gray-400"
                      min="0"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="space-y-4 p-4 bg-gray-800/20 rounded-lg border border-pink-400/20">
              <h3 className="text-pink-400 font-mono text-sm uppercase tracking-wider border-b border-pink-400/20 pb-2">⚙️ SYSTEM_CONFIG.INI</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sortOrder" className="text-white/80 font-mono text-sm uppercase tracking-wider">SORT_ORDER</Label>
                  <Input
                    id="sortOrder"
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                    placeholder="0"
                    className="bg-gray-800/50 border-gray-500/30 text-white font-mono placeholder-gray-400"
                    min="0"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-green-400/50 bg-gray-800/50 text-green-400 focus:ring-green-400 focus:ring-offset-0"
                  />
                  <Label htmlFor="isActive" className="text-green-400 font-mono text-sm uppercase tracking-wider cursor-pointer">
                    ACTIVE_STATUS
                  </Label>
                </div>
              </div>
            </div>

            </form>
          </div>
        </div>
        
        {/* Fixed Bottom Action Bar */}
        <div className="relative z-20 p-6 border-t border-cyan-400/30 bg-gray-900/90 backdrop-blur-sm">
          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading} 
              onClick={handleSubmit}
              className="flex-1 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-mono uppercase tracking-wider shadow-lg disabled:opacity-50 transition-all duration-300 hover:scale-105"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                  PROCESSING...
                </>
              ) : (
                <>
                  <span className="mr-2">{product ? '📝' : '➕'}</span>
                  {product ? 'UPDATE_PRODUCT' : 'CREATE_PRODUCT'}
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="h-12 px-6 border-red-400/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 font-mono uppercase tracking-wider transition-all duration-300 hover:scale-105"
            >
              <span className="mr-2">❌</span>
              CANCEL
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
