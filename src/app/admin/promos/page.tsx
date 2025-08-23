'use client'

import React, { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Percent,
  Tag,
  Users,
  ShoppingCart
} from 'lucide-react'
import { StatusBadge } from '@/components/ui/status-badge'
import { cn } from '@/lib/utils'

interface Promo {
  id: string
  code: string
  name: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minAmount?: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  validFrom: string
  validTo: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PromoPage() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    validFrom: '',
    validTo: '',
    isActive: true
  })

  useEffect(() => {
    loadPromos()
  }, [])

  const loadPromos = async () => {
    try {
      const response = await fetch('/api/admin/promos')
      const result = await response.json()
      if (result.success) {
        setPromos(result.data)
      }
    } catch (error) {
      console.error('Failed to load promos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingPromo 
        ? `/api/admin/promos/${editingPromo.id}`
        : '/api/admin/promos'
      
      const method = editingPromo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          minAmount: formData.minAmount ? parseFloat(formData.minAmount) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await loadPromos()
        resetForm()
        setShowAddModal(false)
        setEditingPromo(null)
      } else {
        alert(result.message || 'Failed to save promo')
      }
    } catch (error) {
      console.error('Failed to save promo:', error)
      alert('Failed to save promo')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo?')) return

    try {
      const response = await fetch(`/api/admin/promos/${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (result.success) {
        await loadPromos()
      } else {
        alert(result.message || 'Failed to delete promo')
      }
    } catch (error) {
      console.error('Failed to delete promo:', error)
      alert('Failed to delete promo')
    }
  }

  const handleEdit = (promo: Promo) => {
    setEditingPromo(promo)
    setFormData({
      code: promo.code,
      name: promo.name,
      description: promo.description || '',
      type: promo.type,
      value: promo.value.toString(),
      minAmount: promo.minAmount?.toString() || '',
      maxDiscount: promo.maxDiscount?.toString() || '',
      usageLimit: promo.usageLimit?.toString() || '',
      validFrom: promo.validFrom.split('T')[0],
      validTo: promo.validTo.split('T')[0],
      isActive: promo.isActive
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'PERCENTAGE',
      value: '',
      minAmount: '',
      maxDiscount: '',
      usageLimit: '',
      validFrom: '',
      validTo: '',
      isActive: true
    })
  }

  const filteredPromos = promos.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDiscount = (type: string, value: number) => {
    return type === 'PERCENTAGE' 
      ? `${value}%` 
      : `Rp ${value.toLocaleString('id-ID')}`
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Promo Management</h1>
            <p className="text-white/70">Manage discount codes and promotions</p>
          </div>
          <Button
            onClick={() => {
              resetForm()
              setEditingPromo(null)
              setShowAddModal(true)
            }}
            className="bg-gradient-to-r from-neon-blue to-neon-cyan"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Promo
          </Button>
        </div>

        {/* Search */}
        <GlassCard className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search promos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white"
            />
          </div>
        </GlassCard>

        {/* Promos List */}
        <GlassCard className="p-6">
          <div className="space-y-4">
            {filteredPromos.map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-neon-blue" />
                        <span className="font-mono font-bold text-white">
                          {promo.code}
                        </span>
                      </div>
                      <Badge 
                        variant={promo.type === 'PERCENTAGE' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {formatDiscount(promo.type, promo.value)}
                      </Badge>
                      <StatusBadge 
                        status={promo.isActive ? 'success' : 'failed'}
                      >
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </StatusBadge>
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1">
                      {promo.name}
                    </h3>
                    
                    {promo.description && (
                      <p className="text-white/70 text-sm mb-2">
                        {promo.description}
                      </p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(promo.validFrom).toLocaleDateString('id-ID')} -
                        {new Date(promo.validTo).toLocaleDateString('id-ID')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Used: {promo.usedCount}
                        {promo.usageLimit && ` / ${promo.usageLimit}`}
                      </div>
                      {promo.minAmount && (
                        <div className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          Min: Rp {promo.minAmount.toLocaleString('id-ID')}
                        </div>
                      )}
                      {promo.maxDiscount && promo.type === 'PERCENTAGE' && (
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          Max: Rp {promo.maxDiscount.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(promo)}
                      className="text-neon-blue hover:text-neon-blue/80"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(promo.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPromos.length === 0 && (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No promos found</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <GlassCard className="w-full max-w-md p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {editingPromo ? 'Edit Promo' : 'Add New Promo'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Promo Code</Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      placeholder="NEWUSER20"
                      required
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as 'PERCENTAGE' | 'FIXED'})}
                      className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/20 text-white"
                    >
                      <option value="PERCENTAGE">Percentage</option>
                      <option value="FIXED">Fixed Amount</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Promo Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="New User Discount"
                    required
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Special discount for new users"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Discount Value {formData.type === 'PERCENTAGE' ? '(%)' : '(Rp)'}
                    </Label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({...formData, value: e.target.value})}
                      placeholder={formData.type === 'PERCENTAGE' ? '20' : '50000'}
                      required
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label>Usage Limit</Label>
                    <Input
                      type="number"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                      placeholder="100"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Amount (Rp)</Label>
                    <Input
                      type="number"
                      value={formData.minAmount}
                      onChange={(e) => setFormData({...formData, minAmount: e.target.value})}
                      placeholder="100000"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  {formData.type === 'PERCENTAGE' && (
                    <div>
                      <Label>Max Discount (Rp)</Label>
                      <Input
                        type="number"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                        placeholder="25000"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valid From</Label>
                    <Input
                      type="date"
                      value={formData.validFrom}
                      onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                      required
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div>
                    <Label>Valid To</Label>
                    <Input
                      type="date"
                      value={formData.validTo}
                      onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                      required
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <Label htmlFor="isActive">Active</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-neon-blue to-neon-cyan">
                    {editingPromo ? 'Update' : 'Create'} Promo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowAddModal(false)
                      setEditingPromo(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
