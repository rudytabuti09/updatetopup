'use client'

import * as React from 'react'
import { 
  Users, 
  Search, 
  MoreHorizontal,
  Shield,
  ShieldCheck,
  Ban,
  Calendar,
  Eye,
  Edit,
  UserCheck,
  UserX,
  Coins
} from 'lucide-react'
import { AdminLayout } from '@/components/layout/admin-layout'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  balance: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count: {
    orders: number
    transactions: number
  }
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  adminUsers: number
  totalBalance: number
  newUsersToday: number
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = React.useState<User[]>([])
  const [stats, setStats] = React.useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0,
    totalBalance: 0,
    newUsersToday: 0
  })
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [roleFilter, setRoleFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      const result = await response.json()
      
      if (result.success) {
        setUsers(result.data.users)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchUserStats = React.useCallback(async () => {
    try {
      const response = await fetch('/api/admin/users/stats')
      const result = await response.json()
      
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }, [])

  React.useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [fetchUsers, fetchUserStats])

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'promote' | 'demote') => {
    try {
      const response = await fetch('/api/admin/users/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, action })
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message
        })
        fetchUsers()
        fetchUserStats()
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error performing user action:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform action',
        variant: 'destructive'
      })
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'ADMIN': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'USER': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30'
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Memuat data pengguna...</p>
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
          Manajemen Pengguna
        </h1>
        <p className="text-white/70">
          Kelola pengguna, role, dan status akun platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Total Users</p>
              <p className="text-xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-3">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Active</p>
              <p className="text-xl font-bold text-white">{stats.activeUsers}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mr-3">
              <UserX className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Banned</p>
              <p className="text-xl font-bold text-white">{stats.bannedUsers}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Admins</p>
              <p className="text-xl font-bold text-white">{stats.adminUsers}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mr-3">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">Total Balance</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalBalance)}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60">New Today</p>
              <p className="text-xl font-bold text-white">{stats.newUsersToday}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
            <Input
              placeholder="Cari nama, email, atau telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Role</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Users Table */}
      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70 font-medium">User</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Balance</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Orders</th>
                <th className="text-left py-3 px-4 text-white/70 font-medium">Joined</th>
                <th className="text-right py-3 px-4 text-white/70 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-sm text-white/60">{user.email}</div>
                      {user.phone && (
                        <div className="text-xs text-white/40">{user.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                       user.role === 'ADMIN' ? 'Admin' : 'User'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4">
                    <Badge className={getStatusColor(user.isActive)}>
                      {user.isActive ? 'Active' : 'Banned'}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-white font-medium">
                    {formatCurrency(user.balance)}
                  </td>
                  <td className="py-4 px-4 text-white/70">
                    {user._count.orders} orders
                  </td>
                  <td className="py-4 px-4 text-white/70 text-sm">
                    {formatDate(user.createdAt)}
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
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.isActive ? (
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'deactivate')}
                            className="text-red-400"
                          >
                            <Ban className="h-4 w-4 mr-2" />
                            Ban User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'activate')}
                            className="text-green-400"
                          >
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        {user.role === 'USER' && (
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'promote')}
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Promote to Admin
                          </DropdownMenuItem>
                        )}
                        {user.role === 'ADMIN' && (
                          <DropdownMenuItem 
                            onClick={() => handleUserAction(user.id, 'demote')}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Demote to User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">Tidak ada pengguna ditemukan</p>
            </div>
          )}
        </div>
      </GlassCard>
    </AdminLayout>
  )
}
