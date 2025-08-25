'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  isActive: boolean
  sortOrder: number
  services: Service[]
}

interface Service {
  id: string
  categoryId: string
  name: string
  slug: string
  description?: string
  provider: string
  isActive: boolean
  sortOrder: number
}

interface FormData {
  name: string
  slug: string
  description: string
  icon: string
  provider?: string
  sortOrder: string
}

export default function CategoriesManagementPage() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingService, setEditingService] = useState<string | null>(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddService, setShowAddService] = useState<string | null>(null)
  
  const [categoryForm, setCategoryForm] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    sortOrder: '0'
  })
  
  const [serviceForm, setServiceForm] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    icon: '',
    provider: '',
    sortOrder: '0'
  })

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const result = await response.json()
      if (result.success) {
        setCategories(result.data)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive'
      })
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Handle category form changes
  const handleCategoryChange = (field: string, value: string) => {
    setCategoryForm(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'name') {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  // Handle service form changes
  const handleServiceChange = (field: string, value: string) => {
    setServiceForm(prev => {
      const updated = { ...prev, [field]: value }
      if (field === 'name') {
        updated.slug = generateSlug(value)
        updated.provider = generateSlug(value)
      }
      return updated
    })
  }

  // Save category
  const saveCategory = async (categoryId?: string) => {
    setLoading(true)
    try {
      const url = categoryId ? '/api/admin/categories' : '/api/admin/categories'
      const method = categoryId ? 'PUT' : 'POST'
      const data = categoryId 
        ? { id: categoryId, ...categoryForm }
        : categoryForm

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: 'Success',
          description: categoryId ? 'Category updated' : 'Category created'
        })
        setShowAddCategory(false)
        setEditingCategory(null)
        setCategoryForm({ name: '', slug: '', description: '', icon: '', sortOrder: '0' })
        loadCategories()
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
        description: 'Failed to save category',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Save service
  const saveService = async (categoryId: string, serviceId?: string) => {
    setLoading(true)
    try {
      const url = serviceId ? '/api/admin/services' : '/api/admin/services'
      const method = serviceId ? 'PUT' : 'POST'
      const data = serviceId 
        ? { id: serviceId, ...serviceForm }
        : { categoryId, ...serviceForm }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()
      if (result.success) {
        toast({
          title: 'Success',
          description: serviceId ? 'Service updated' : 'Service created'
        })
        setShowAddService(null)
        setEditingService(null)
        setServiceForm({ name: '', slug: '', description: '', icon: '', provider: '', sortOrder: '0' })
        loadCategories()
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
        description: 'Failed to save service',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  // Quick add popular categories and services
  const addPopularData = async () => {
    const popularCategories = [
      {
        name: 'Game Online',
        slug: 'game',
        description: 'Top up diamond, coin, dan item game online favorit',
        icon: '🎮',
        sortOrder: '1',
        services: [
          { name: 'Mobile Legends', slug: 'mobile-legends', provider: 'mobile-legends', description: 'Top up diamond Mobile Legends Bang Bang' },
          { name: 'Free Fire', slug: 'free-fire', provider: 'free-fire', description: 'Top up diamond Free Fire' },
          { name: 'PUBG Mobile', slug: 'pubg-mobile', provider: 'pubg-mobile', description: 'Top up UC PUBG Mobile' },
          { name: 'Call of Duty Mobile', slug: 'cod-mobile', provider: 'cod-mobile', description: 'Top up CP Call of Duty Mobile' },
          { name: 'Genshin Impact', slug: 'genshin-impact', provider: 'genshin-impact', description: 'Top up Genesis Crystal Genshin Impact' },
          { name: 'Valorant', slug: 'valorant', provider: 'valorant', description: 'Top up Valorant Points' }
        ]
      },
      {
        name: 'Pulsa & Data',
        slug: 'pulsa',
        description: 'Isi pulsa dan paket data semua operator',
        icon: '📱',
        sortOrder: '2',
        services: [
          { name: 'Telkomsel', slug: 'telkomsel', provider: 'telkomsel', description: 'Isi pulsa dan paket data Telkomsel' },
          { name: 'Indosat Ooredoo', slug: 'indosat', provider: 'indosat', description: 'Isi pulsa dan paket data Indosat' },
          { name: 'XL Axiata', slug: 'xl', provider: 'xl', description: 'Isi pulsa dan paket data XL' },
          { name: 'Tri (3)', slug: 'tri', provider: 'tri', description: 'Isi pulsa dan paket data Tri' }
        ]
      },
      {
        name: 'E-Money',
        slug: 'e-money',
        description: 'Top up saldo e-wallet dan payment digital',
        icon: '💳',
        sortOrder: '3',
        services: [
          { name: 'GoPay', slug: 'gopay', provider: 'gopay', description: 'Top up saldo GoPay' },
          { name: 'OVO', slug: 'ovo', provider: 'ovo', description: 'Top up saldo OVO' },
          { name: 'DANA', slug: 'dana', provider: 'dana', description: 'Top up saldo DANA' },
          { name: 'ShopeePay', slug: 'shopeepay', provider: 'shopeepay', description: 'Top up saldo ShopeePay' }
        ]
      }
    ]

    setLoading(true)
    try {
      for (const categoryData of popularCategories) {
        const { services, ...catData } = categoryData
        
        // Create category
        const catResponse = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(catData)
        })
        
        const catResult = await catResponse.json()
        if (catResult.success) {
          // Create services for this category
          for (const serviceData of services) {
            await fetch('/api/admin/services', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                categoryId: catResult.data.id,
                ...serviceData,
                sortOrder: services.indexOf(serviceData) + 1
              })
            })
          }
        }
      }

      toast({
        title: 'Success',
        description: 'Popular categories and services added!'
      })
      loadCategories()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add popular data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-mono text-cyan-400 mb-2">
              📂 CATEGORIES_MANAGER.SYS
            </h1>
            <p className="text-gray-400 font-mono">
              Manage product categories and services // WMX_ADMIN
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={addPopularData}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-mono"
            >
              ⚡ Quick Setup
            </Button>
            <Button
              onClick={() => setShowAddCategory(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 font-mono"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <Card className="mb-6 bg-gray-900/50 border-cyan-400/30">
          <CardHeader>
            <CardTitle className="text-cyan-400 font-mono">Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white font-mono">Category Name</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => handleCategoryChange('name', e.target.value)}
                  placeholder="e.g., Game Online"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white font-mono">Slug</Label>
                <Input
                  value={categoryForm.slug}
                  onChange={(e) => handleCategoryChange('slug', e.target.value)}
                  placeholder="Auto-generated"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white font-mono">Icon</Label>
                <Input
                  value={categoryForm.icon}
                  onChange={(e) => handleCategoryChange('icon', e.target.value)}
                  placeholder="🎮"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white font-mono">Sort Order</Label>
                <Input
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) => handleCategoryChange('sortOrder', e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label className="text-white font-mono">Description</Label>
              <Input
                value={categoryForm.description}
                onChange={(e) => handleCategoryChange('description', e.target.value)}
                placeholder="Category description"
                className="bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => saveCategory()}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Category
              </Button>
              <Button
                onClick={() => setShowAddCategory(false)}
                variant="outline"
                className="border-gray-600 text-white"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-6">
        {categories.map((category) => (
          <Card key={category.id} className="bg-gray-900/50 border-cyan-400/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-cyan-400 font-mono flex items-center">
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                  <span className="ml-2 text-xs text-gray-500">({category.services.length} services)</span>
                </CardTitle>
                <Button
                  onClick={() => setShowAddService(category.id)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 font-mono"
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.services.map((service) => (
                  <div
                    key={service.id}
                    className="p-4 bg-gray-800/50 border border-gray-600 rounded-lg"
                  >
                    <h4 className="text-white font-mono font-semibold mb-1">
                      {service.name}
                    </h4>
                    <p className="text-gray-400 text-sm mb-2">
                      {service.description}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      Provider: {service.provider}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Service Form */}
              {showAddService === category.id && (
                <div className="mt-4 p-4 bg-gray-800/30 border border-purple-400/30 rounded-lg">
                  <h4 className="text-purple-400 font-mono mb-4">Add Service to {category.name}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-white font-mono">Service Name</Label>
                      <Input
                        value={serviceForm.name}
                        onChange={(e) => handleServiceChange('name', e.target.value)}
                        placeholder="e.g., Mobile Legends"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-white font-mono">Provider Code</Label>
                      <Input
                        value={serviceForm.provider}
                        onChange={(e) => handleServiceChange('provider', e.target.value)}
                        placeholder="Auto-generated"
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label className="text-white font-mono">Description</Label>
                    <Input
                      value={serviceForm.description}
                      onChange={(e) => handleServiceChange('description', e.target.value)}
                      placeholder="Service description"
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveService(category.id)}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Add Service
                    </Button>
                    <Button
                      onClick={() => setShowAddService(null)}
                      variant="outline"
                      className="border-gray-600 text-white"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-mono text-gray-400 mb-2">No Categories Found</h3>
            <p className="text-gray-500 mb-4">Start by adding your first category or use Quick Setup</p>
            <Button
              onClick={addPopularData}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-mono"
            >
              ⚡ Quick Setup Popular Categories
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
