import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useNotification } from '../contexts/NotificationContext';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalGames: 0,
    todayRevenue: 0,
    todayTransactions: 0,
    successRate: 95.5,
    vipBalance: 10000000
  });
  const [revenueData, setRevenueData] = useState([]);
  const [topGames, setTopGames] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const { showError } = useNotification();

  // Load admin statistics
  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_admin_stats');
      
      if (error) {
        console.error('Error loading admin stats:', error);
        showError('Failed to load admin statistics', 'Database Error');
        return;
      }

      if (data) {
        setAdminStats({
          totalRevenue: data.total_revenue || 0,
          totalTransactions: data.total_transactions || 0,
          totalUsers: data.total_users || 0,
          totalGames: data.total_games || 0,
          todayRevenue: data.today_revenue || 0,
          todayTransactions: data.today_transactions || 0,
          successRate: data.success_rate || 95.5,
          vipBalance: data.vip_balance || 10000000
        });
      }
    } catch (error) {
      console.error('Error loading admin stats:', error);
      showError('Failed to load admin statistics', 'Network Error');
    } finally {
      setLoading(false);
    }
  };

  // Load revenue data for charts
  const loadRevenueData = async (days = 30) => {
    try {
      const { data, error } = await supabase.rpc('get_revenue_data', { days_back: days });
      
      if (error) {
        console.error('Error loading revenue data:', error);
        return;
      }

      if (data) {
        const processedData = data.map(item => ({
          date: item.date,
          revenue: parseFloat(item.revenue) || 0,
          transactions: parseInt(item.transaction_count) || 0,
          label: new Date(item.date).toLocaleDateString('id-ID', { 
            month: 'short', 
            day: 'numeric' 
          })
        }));
        setRevenueData(processedData);
      }
    } catch (error) {
      console.error('Error loading revenue data:', error);
    }
  };

  // Load top games by revenue
  const loadTopGames = async (limit = 10) => {
    try {
      const { data, error } = await supabase.rpc('get_top_games_by_revenue', { limit_count: limit });
      
      if (error) {
        console.error('Error loading top games:', error);
        return;
      }

      if (data) {
        setTopGames(data);
      }
    } catch (error) {
      console.error('Error loading top games:', error);
    }
  };

  // Load recent transactions
  const loadRecentTransactions = async (limit = 20) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(id, username, full_name, avatar_url),
          games(id, name, icon_url),
          game_packages(id, name, amount)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error loading recent transactions:', error);
        return;
      }

      if (data) {
        setRecentTransactions(data);
      }
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    }
  };

  // Load users with search and filters
  const loadUsers = async (searchTerm = '', roleFilter = null, limit = 100, offset = 0) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('search_users', {
        search_term: searchTerm,
        role_filter: roleFilter,
        limit_count: limit,
        offset_count: offset
      });

      if (error) {
        console.error('Error loading users:', error);
        // Fallback to basic query
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (!fallbackError && fallbackData) {
          setUsers(fallbackData);
        }
        return;
      }

      if (data) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { success: false, error: error.message };
    }
  };

  // Update user verification status
  const updateUserVerification = async (userId, isVerified) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_verified: isVerified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_verified: isVerified } : user
      ));

      return { success: true };
    } catch (error) {
      console.error('Error updating user verification:', error);
      return { success: false, error: error.message };
    }
  };

  // Update game status
  const updateGameStatus = async (gameId, isActive) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', gameId);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating game status:', error);
      return { success: false, error: error.message };
    }
  };

  // Update system settings
  const updateSystemSetting = async (key, value) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          key,
          value,
          updated_at: new Date().toISOString()
        });

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating system setting:', error);
      return { success: false, error: error.message };
    }
  };

  // Refresh all data
  const refreshAllData = async () => {
    await Promise.all([
      loadAdminStats(),
      loadRevenueData(),
      loadTopGames(),
      loadRecentTransactions(),
      loadUsers()
    ]);
  };

  return {
    loading,
    adminStats,
    revenueData,
    topGames,
    recentTransactions,
    users,
    loadAdminStats,
    loadRevenueData,
    loadTopGames,
    loadRecentTransactions,
    loadUsers,
    updateUserRole,
    updateUserVerification,
    updateGameStatus,
    updateSystemSetting,
    refreshAllData
  };
};

export default useAdminData;