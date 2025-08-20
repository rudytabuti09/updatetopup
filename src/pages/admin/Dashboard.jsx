import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import useAdminData from '../../hooks/useAdminData';
import { useVipResellerApi } from '../../hooks/useVipResellerApi';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import StatsCards from './components/StatsCards';
import RevenueChart from './components/RevenueChart';
import RecentTransactions from './components/RecentTransactions';
import SystemStatus from './components/SystemStatus';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { 
    allGames, 
    userTransactions, 
    systemSettings,
    isLoading 
  } = useSupabaseData();
  
  const { 
    loading: vipLoading,
    getServices,
    checkOrderStatus 
  } = useVipResellerApi();

  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    totalUsers: 0,
    totalGames: 0,
    todayRevenue: 0,
    todayTransactions: 0,
    successRate: 0,
    vipBalance: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    supabase: 'healthy',
    vipReseller: 'checking',
    server: 'healthy'
  });

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
    checkSystemHealth();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Import supabase for direct RPC calls
      const { supabase } = await import('../../utils/supabase');
      
      // Get real admin stats from database
      const { data: adminStats, error: statsError } = await supabase
        .rpc('get_admin_stats');

      if (statsError) {
        console.error('Error fetching admin stats:', statsError);
        // Fallback to calculated stats
        const totalRevenue = userTransactions?.reduce((sum, tx) => sum + (tx.total_amount || 0), 0) || 0;
        const totalTransactions = userTransactions?.length || 0;
        const totalGames = allGames?.length || 0;
        
        setDashboardStats({
          totalRevenue,
          totalTransactions,
          totalUsers: 0,
          totalGames,
          todayRevenue: 0,
          todayTransactions: 0,
          successRate: 95.5,
          vipBalance: 10000000
        });
      } else {
        // Use real data from database
        setDashboardStats({
          totalRevenue: adminStats.total_revenue || 0,
          totalTransactions: adminStats.total_transactions || 0,
          totalUsers: adminStats.total_users || 0,
          totalGames: adminStats.total_games || 0,
          todayRevenue: adminStats.today_revenue || 0,
          todayTransactions: adminStats.today_transactions || 0,
          successRate: adminStats.success_rate || 95.5,
          vipBalance: adminStats.vip_balance || 10000000
        });
      }

      // Get recent transactions from database
      const { data: recentTx, error: txError } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles(username, full_name),
          games(name, icon_url),
          game_packages(name, amount)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!txError && recentTx) {
        setRecentActivity(recentTx);
      } else {
        // Fallback to userTransactions
        setRecentActivity(userTransactions?.slice(0, 10) || []);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Fallback to basic stats
      setDashboardStats({
        totalRevenue: 0,
        totalTransactions: 0,
        totalUsers: 0,
        totalGames: allGames?.length || 0,
        todayRevenue: 0,
        todayTransactions: 0,
        successRate: 95.5,
        vipBalance: 10000000
      });
    }
  };

  const checkSystemHealth = async () => {
    try {
      // Check VIP Reseller API
      setSystemHealth(prev => ({ ...prev, vipReseller: 'checking' }));
      
      const vipTest = await getServices('game', null, 'available');
      setSystemHealth(prev => ({ 
        ...prev, 
        vipReseller: vipTest ? 'healthy' : 'error' 
      }));
    } catch (error) {
      setSystemHealth(prev => ({ ...prev, vipReseller: 'error' }));
    }
  };

  const refreshData = () => {
    loadDashboardData();
    checkSystemHealth();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Check admin access
  if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" size={32} className="text-red-500" />
          </div>
          <h2 className="text-xl font-gaming font-bold text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-text-secondary">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - WMX TOPUP | Control Panel</title>
        <meta name="description" content="WMX TOPUP Admin Dashboard for managing games, users, transactions, and VIP Reseller integration." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <AdminHeader user={user} profile={profile} onRefresh={refreshData} />
        
        <div className="flex">
          <AdminSidebar />
          
          <main className="flex-1 ml-64 p-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-gaming font-bold text-gaming-gradient mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-text-secondary">
                    Welcome back, {profile?.full_name || profile?.username}! Here's what's happening with WMX TOPUP.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={refreshData}
                    className="bg-surface/50 hover:bg-surface/70 text-foreground px-4 py-2 rounded-lg border border-border/50 hover:border-primary/30 transition-all duration-200 flex items-center gap-2"
                  >
                    <Icon name="RefreshCw" size={16} />
                    Refresh
                  </button>
                  <QuickActions />
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={dashboardStats} loading={vipLoading} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
              {/* Revenue Chart */}
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>

              {/* System Status */}
              <div>
                <SystemStatus 
                  health={systemHealth} 
                  stats={dashboardStats}
                  onRefresh={checkSystemHealth}
                />
              </div>
            </div>

            {/* Recent Transactions */}
            <RecentTransactions 
              transactions={recentActivity}
              onRefresh={loadDashboardData}
            />
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;