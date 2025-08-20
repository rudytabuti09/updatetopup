import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import useSupabaseData from '../../hooks/useSupabaseData';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';

const UserManagement = () => {
  const { user, profile } = useAuth();
  const { isLoading } = useSupabaseData();
  const { showSuccess, showError, showInfo } = useNotification();

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  // Load real users data from database
  useEffect(() => {
    loadUsers();
  }, [searchTerm, filterRole, sortBy, sortOrder]);

  const loadUsers = async () => {
    try {
      const { supabase } = await import('../../utils/supabase');
      
      // Use the search_users RPC function for better performance
      const { data: usersData, error } = await supabase
        .rpc('search_users', {
          search_term: searchTerm,
          role_filter: filterRole === 'all' ? null : filterRole,
          limit_count: 100,
          offset_count: 0
        });

      if (error) {
        console.error('Error fetching users:', error);
        showError('Failed to load users', 'Database Error');
        // Fallback to basic query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            full_name,
            role,
            is_verified,
            total_spent,
            total_transactions,
            created_at,
            updated_at,
            phone_number,
            avatar_url
          `)
          .order(sortBy, { ascending: sortOrder === 'asc' })
          .limit(100);

        if (!fallbackError && fallbackData) {
          // Add email from auth.users if needed
          const processedUsers = fallbackData.map(user => ({
            ...user,
            email: user.email || 'N/A',
            status: 'active',
            last_login: user.updated_at
          }));
          setUsers(processedUsers);
        } else {
          setUsers([]);
        }
        return;
      }

      if (usersData) {
        // Process the data to match our expected format
        const processedUsers = usersData.map(user => ({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          role: user.role,
          status: 'active', // Default status
          avatar_url: null, // Will be added later if needed
          created_at: user.created_at,
          last_login: user.created_at, // Use created_at as fallback
          total_transactions: user.total_transactions || 0,
          total_spent: user.total_spent || 0,
          phone: null, // Will be added later if needed
          is_verified: user.is_verified,
          banned_until: null
        }));

        setUsers(processedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showError('Failed to load users', 'Network Error');
      setUsers([]);
    }
  };

  // Fallback mock data for development
  const mockUsers = [
    {
      id: '1',
      email: 'john.doe@example.com',
      full_name: 'John Doe',
      username: 'johndoe',
      role: 'customer',
      status: 'active',
      avatar_url: null,
      created_at: '2024-01-15T10:30:00Z',
      last_login: '2024-01-20T14:22:00Z',
      total_transactions: 15,
      total_spent: 750000,
      phone: '+62812345678',
      is_verified: true,
      banned_until: null
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
        full_name: 'Jane Smith',
        username: 'janesmith',
        role: 'user',
        status: 'active',
        avatar_url: 'https://randomuser.me/api/portraits/women/1.jpg',
        created_at: '2024-01-10T08:15:00Z',
        last_login: '2024-01-21T09:45:00Z',
        total_transactions: 32,
        total_spent: 1250000,
        phone: '+62812345679',
        is_verified: true,
        banned_until: null
      },
      {
        id: '3',
        email: 'admin@wmxtopup.com',
        full_name: 'Admin User',
        username: 'admin',
        role: 'admin',
        status: 'active',
        avatar_url: null,
        created_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-21T16:30:00Z',
        total_transactions: 0,
        total_spent: 0,
        phone: '+62812345680',
        is_verified: true,
        banned_until: null
      },
      {
        id: '4',
        email: 'banned.user@example.com',
        full_name: 'Banned User',
        username: 'banneduser',
        role: 'user',
        status: 'banned',
        avatar_url: null,
        created_at: '2024-01-05T12:00:00Z',
        last_login: '2024-01-18T10:00:00Z',
        total_transactions: 5,
        total_spent: 150000,
        phone: '+62812345681',
        is_verified: false,
        banned_until: '2024-02-01T00:00:00Z'
      }
    ];
    setUsers(mockUsers);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'last_login') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const handleUserAction = async (userId, action) => {
    try {
      switch (action) {
        case 'ban':
          setUsers(prev => prev.map(u => 
            u.id === userId 
              ? { ...u, status: 'banned', banned_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() }
              : u
          ));
          showSuccess('User banned successfully', 'User Banned');
          break;
        case 'unban':
          setUsers(prev => prev.map(u => 
            u.id === userId 
              ? { ...u, status: 'active', banned_until: null }
              : u
          ));
          showSuccess('User unbanned successfully', 'User Unbanned');
          break;
        case 'verify':
          setUsers(prev => prev.map(u => 
            u.id === userId 
              ? { ...u, is_verified: true }
              : u
          ));
          showSuccess('User verified successfully', 'User Verified');
          break;
        case 'promote':
          setUsers(prev => prev.map(u => 
            u.id === userId 
              ? { ...u, role: 'moderator' }
              : u
          ));
          showSuccess('User promoted to moderator', 'User Promoted');
          break;
        case 'demote':
          setUsers(prev => prev.map(u => 
            u.id === userId 
              ? { ...u, role: 'user' }
              : u
          ));
          showSuccess('User demoted to regular user', 'User Demoted');
          break;
        default:
          break;
      }
    } catch (error) {
      showError(`Failed to ${action} user`, 'Error');
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      showInfo('Please select users first', 'No Users Selected');
      return;
    }

    try {
      selectedUsers.forEach(userId => {
        handleUserAction(userId, action);
      });
      setSelectedUsers([]);
      showSuccess(`Bulk ${action} completed`, 'Bulk Action Complete');
    } catch (error) {
      showError(`Failed to perform bulk ${action}`, 'Error');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-500 bg-red-500/10';
      case 'moderator': return 'text-orange-500 bg-orange-500/10';
      case 'user': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-text-secondary bg-surface/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'banned': return 'text-red-500 bg-red-500/10';
      case 'inactive': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-text-secondary bg-surface/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Management - WMX TOPUP Admin</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <AdminHeader user={user} profile={profile} />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 ml-64 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-gaming font-bold text-gaming-gradient mb-2">
                  User Management
                </h1>
                <p className="text-text-secondary">
                  Manage users, roles, and permissions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">
                  <Icon name="Download" size={16} className="mr-2" />
                  Export Users
                </Button>
                <Button>
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {users.length}
                    </div>
                    <div className="text-sm text-text-secondary">Total Users</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="UserCheck" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {users.filter(u => u.status === 'active').length}
                    </div>
                    <div className="text-sm text-text-secondary">Active Users</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="UserX" size={24} className="text-red-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {users.filter(u => u.status === 'banned').length}
                    </div>
                    <div className="text-sm text-text-secondary">Banned Users</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Shield" size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {users.filter(u => u.role === 'admin' || u.role === 'moderator').length}
                    </div>
                    <div className="text-sm text-text-secondary">Staff Members</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-gaming mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, or username..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="moderator">Moderators</option>
                    <option value="admin">Admins</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                    <option value="full_name-asc">Name A-Z</option>
                    <option value="full_name-desc">Name Z-A</option>
                    <option value="total_spent-desc">Highest Spender</option>
                    <option value="total_transactions-desc">Most Transactions</option>
                  </select>
                </div>
              </div>
              
              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-text-secondary">
                    {selectedUsers.length} user(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('verify')}
                    >
                      Verify
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleBulkAction('ban')}
                      className="text-red-500 border-red-500/20 hover:bg-red-500/10"
                    >
                      Ban
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedUsers([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-card rounded-xl border border-border shadow-gaming overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface/20 border-b border-border">
                    <tr>
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(currentUsers.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-border"
                        />
                      </th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">User</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Role</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Status</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Transactions</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Total Spent</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Last Login</th>
                      <th className="text-left p-4 font-gaming font-bold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-surface/10 transition-colors">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers(prev => [...prev, user.id]);
                              } else {
                                setSelectedUsers(prev => prev.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-border"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.avatar_url ? (
                              <Image
                                src={user.avatar_url}
                                alt={user.full_name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-black">
                                  {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-foreground">
                                {user.full_name || user.username}
                              </div>
                              <div className="text-sm text-text-secondary">{user.email}</div>
                              {user.is_verified && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Icon name="CheckCircle" size={12} className="text-green-500" />
                                  <span className="text-xs text-green-500">Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                          {user.banned_until && (
                            <div className="text-xs text-red-500 mt-1">
                              Until: {formatDate(user.banned_until)}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">{user.total_transactions}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-foreground">
                            {formatCurrency(user.total_spent)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-text-secondary">
                            {formatDate(user.last_login)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Icon name="Eye" size={14} className="text-text-secondary" />
                            </button>
                            
                            {user.status === 'banned' ? (
                              <button
                                onClick={() => handleUserAction(user.id, 'unban')}
                                className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                                title="Unban User"
                              >
                                <Icon name="UserCheck" size={14} />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                                title="Ban User"
                              >
                                <Icon name="UserX" size={14} />
                              </button>
                            )}
                            
                            {user.role === 'user' && (
                              <button
                                onClick={() => handleUserAction(user.id, 'promote')}
                                className="p-2 hover:bg-orange-500/10 text-orange-500 rounded-lg transition-colors"
                                title="Promote to Moderator"
                              >
                                <Icon name="ArrowUp" size={14} />
                              </button>
                            )}
                            
                            {user.role === 'moderator' && (
                              <button
                                onClick={() => handleUserAction(user.id, 'demote')}
                                className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"
                                title="Demote to User"
                              >
                                <Icon name="ArrowDown" size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border">
                  <div className="text-sm text-text-secondary">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <Icon name="ChevronLeft" size={14} />
                    </Button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="px-2 text-text-secondary">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      ))
                    }
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      <Icon name="ChevronRight" size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserManagement;