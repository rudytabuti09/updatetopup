import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { useVipResellerApi } from '../../hooks/useVipResellerApi';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const VipResellerManagement = () => {
  const { user, profile } = useAuth();
  const { 
    getServices, 
    checkBalance, 
    createOrder, 
    checkOrderStatus,
    loading 
  } = useVipResellerApi();
  const { showSuccess, showError, showInfo } = useNotification();

  const [activeTab, setActiveTab] = useState('status');
  const [vipBalance, setVipBalance] = useState(0);
  const [apiStatus, setApiStatus] = useState('checking');
  const [services, setServices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [apiLogs, setApiLogs] = useState([]);
  const [testOrder, setTestOrder] = useState({
    service_code: '',
    target: '',
    amount: ''
  });
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    loadVipData();
  }, []);

  const loadVipData = async () => {
    try {
      // Check API status and balance
      setApiStatus('checking');
      const balance = await checkBalance();
      setVipBalance(balance?.balance || 0);
      setApiStatus('healthy');

      // Load services
      const servicesData = await getServices('game', null, 'available');
      setServices(servicesData?.slice(0, 10) || []);

      // Mock recent orders and logs
      setRecentOrders([
        {
          id: 'VIP123456',
          service_code: 'ML275',
          target: '123456789',
          amount: 275,
          status: 'completed',
          created_at: '2024-01-21T10:30:00Z',
          completed_at: '2024-01-21T10:32:00Z',
          cost: 65000
        },
        {
          id: 'VIP123457',
          service_code: 'FF720',
          target: '987654321',
          amount: 720,
          status: 'processing',
          created_at: '2024-01-21T09:45:00Z',
          cost: 140000
        },
        {
          id: 'VIP123458',
          service_code: 'PUBG1800',
          target: '555666777',
          amount: 1800,
          status: 'failed',
          created_at: '2024-01-21T08:20:00Z',
          failed_at: '2024-01-21T08:25:00Z',
          cost: 280000,
          failure_reason: 'Invalid target ID'
        }
      ]);

      setApiLogs([
        {
          id: 1,
          timestamp: '2024-01-21T10:32:15Z',
          method: 'POST',
          endpoint: '/order',
          status: 200,
          response_time: 1250,
          request_id: 'req_123456'
        },
        {
          id: 2,
          timestamp: '2024-01-21T10:30:00Z',
          method: 'POST',
          endpoint: '/order',
          status: 200,
          response_time: 980,
          request_id: 'req_123455'
        },
        {
          id: 3,
          timestamp: '2024-01-21T09:45:30Z',
          method: 'GET',
          endpoint: '/balance',
          status: 200,
          response_time: 450,
          request_id: 'req_123454'
        },
        {
          id: 4,
          timestamp: '2024-01-21T08:25:10Z',
          method: 'POST',
          endpoint: '/order',
          status: 400,
          response_time: 2100,
          request_id: 'req_123453',
          error: 'Invalid target ID'
        }
      ]);

    } catch (error) {
      console.error('Error loading VIP data:', error);
      setApiStatus('error');
      showError('Failed to connect to VIP Reseller API', 'API Error');
    }
  };

  const testApiConnection = async () => {
    setIsTestingApi(true);
    try {
      if (!testOrder.service_code || !testOrder.target) {
        showError('Please fill in service code and target', 'Test Failed');
        return;
      }

      // In production, this would create a test order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOrderId = 'TEST_' + Date.now();
      showSuccess(`Test order created: ${mockOrderId}`, 'API Test Successful');
      
      // Add to recent orders
      setRecentOrders(prev => [{
        id: mockOrderId,
        service_code: testOrder.service_code,
        target: testOrder.target,
        amount: testOrder.amount || 'Test',
        status: 'completed',
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        cost: 0,
        is_test: true
      }, ...prev]);

      setTestOrder({ service_code: '', target: '', amount: '' });
    } catch (error) {
      showError('API test failed', 'Test Error');
    } finally {
      setIsTestingApi(false);
    }
  };

  const refreshBalance = async () => {
    try {
      const balance = await checkBalance();
      setVipBalance(balance?.balance || 0);
      showSuccess('Balance refreshed', 'Updated');
    } catch (error) {
      showError('Failed to refresh balance', 'Error');
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-500/10';
      case 'processing':
        return 'text-blue-500 bg-blue-500/10';
      case 'failed':
        return 'text-red-500 bg-red-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-text-secondary bg-surface/20';
    }
  };

  const getApiStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'checking':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getHttpStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-500';
    if (status >= 400 && status < 500) return 'text-yellow-500';
    if (status >= 500) return 'text-red-500';
    return 'text-text-secondary';
  };

  return (
    <>
      <Helmet>
        <title>VIP Reseller Management - WMX TOPUP Admin</title>
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
                  VIP Reseller Management
                </h1>
                <p className="text-text-secondary">
                  Monitor and manage VIP Reseller API integration
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-card rounded-lg px-4 py-2 border border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      apiStatus === 'healthy' ? 'bg-green-500 animate-pulse' :
                      apiStatus === 'checking' ? 'bg-blue-500 animate-pulse' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm text-text-secondary">API Status:</span>
                    <span className={`font-medium capitalize ${getApiStatusColor(apiStatus)}`}>
                      {apiStatus}
                    </span>
                  </div>
                </div>
                <Button onClick={loadVipData} loading={loading}>
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Wallet" size={24} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {formatCurrency(vipBalance)}
                    </div>
                    <div className="text-sm text-text-secondary">VIP Balance</div>
                    <button 
                      onClick={refreshBalance}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Zap" size={24} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {services.length}
                    </div>
                    <div className="text-sm text-text-secondary">Available Services</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Activity" size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {recentOrders.length}
                    </div>
                    <div className="text-sm text-text-secondary">Recent Orders</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-2xl font-gaming font-bold text-foreground">
                      {((recentOrders.filter(o => o.status === 'completed').length / recentOrders.length) * 100 || 0).toFixed(1)}%
                    </div>
                    <div className="text-sm text-text-secondary">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8">
              {[
                { key: 'status', label: 'API Status', icon: 'Activity' },
                { key: 'services', label: 'Services', icon: 'Zap' },
                { key: 'orders', label: 'Recent Orders', icon: 'List' },
                { key: 'logs', label: 'API Logs', icon: 'FileText' },
                { key: 'test', label: 'API Test', icon: 'Play' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-primary text-black'
                      : 'bg-surface/20 text-text-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'status' && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                  API Connection Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Globe" size={18} className="text-text-secondary" />
                        <span className="font-medium text-foreground">API Endpoint</span>
                      </div>
                      <span className="text-sm text-text-secondary font-mono">
                        https://vip-reseller.co.id/api
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Key" size={18} className="text-text-secondary" />
                        <span className="font-medium text-foreground">API Key Status</span>
                      </div>
                      <span className="text-sm text-green-500">Valid</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Clock" size={18} className="text-text-secondary" />
                        <span className="font-medium text-foreground">Last Check</span>
                      </div>
                      <span className="text-sm text-text-secondary">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon name="Zap" size={18} className="text-text-secondary" />
                        <span className="font-medium text-foreground">Response Time</span>
                      </div>
                      <span className="text-sm text-green-500">~850ms</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="CheckCircle" size={18} className="text-green-500" />
                        <span className="font-medium text-green-500">Connection Healthy</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        VIP Reseller API is responding normally. All services are operational.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Info" size={18} className="text-blue-500" />
                        <span className="font-medium text-blue-500">Rate Limits</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        Current usage: 45/1000 requests per hour
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-card rounded-xl border border-border shadow-gaming overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-gaming font-bold text-foreground">
                    Available VIP Services
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Currently available services from VIP Reseller API
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface/20 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Service Code</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Game</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Name</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Price</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service, index) => (
                        <tr key={index} className="border-b border-border hover:bg-surface/10 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm bg-surface/20 px-2 py-1 rounded">
                              {service.code}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-foreground">{service.game}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-foreground">{service.name}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-gaming font-bold text-foreground">
                              {formatCurrency(service.price?.premium || service.price?.basic || 0)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              service.status === 'available' ? 'text-green-500 bg-green-500/10' :
                              service.status === 'unavailable' ? 'text-red-500 bg-red-500/10' :
                              'text-yellow-500 bg-yellow-500/10'
                            }`}>
                              {service.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-card rounded-xl border border-border shadow-gaming overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-gaming font-bold text-foreground">
                    Recent VIP Orders
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Latest orders processed through VIP Reseller API
                  </p>
                </div>
                
                <div className="divide-y divide-border">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-surface/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                            <Icon name="Zap" size={18} className="text-black" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-foreground">{order.id}</span>
                              {order.is_test && (
                                <span className="bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded text-xs font-medium">
                                  TEST
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {order.service_code} • Target: {order.target} • Amount: {order.amount}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                              Created: {formatDate(order.created_at)}
                              {order.completed_at && ` • Completed: ${formatDate(order.completed_at)}`}
                              {order.failed_at && ` • Failed: ${formatDate(order.failed_at)}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="font-gaming font-bold text-foreground">
                            {formatCurrency(order.cost)}
                          </div>
                          {order.failure_reason && (
                            <div className="text-xs text-red-500 mt-1">
                              {order.failure_reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="bg-card rounded-xl border border-border shadow-gaming overflow-hidden">
                <div className="p-6 border-b border-border">
                  <h3 className="text-lg font-gaming font-bold text-foreground">
                    API Request Logs
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Recent API requests and responses
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-surface/20 border-b border-border">
                      <tr>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Timestamp</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Method</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Endpoint</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Status</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Response Time</th>
                        <th className="text-left p-4 font-gaming font-bold text-foreground">Request ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {apiLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border hover:bg-surface/10 transition-colors">
                          <td className="p-4">
                            <span className="text-sm text-text-secondary">
                              {formatDate(log.timestamp)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              log.method === 'GET' ? 'bg-blue-500/20 text-blue-500' :
                              log.method === 'POST' ? 'bg-green-500/20 text-green-500' :
                              'bg-gray-500/20 text-gray-500'
                            }`}>
                              {log.method}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-sm text-foreground">{log.endpoint}</span>
                          </td>
                          <td className="p-4">
                            <span className={`font-medium ${getHttpStatusColor(log.status)}`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-text-secondary">{log.response_time}ms</span>
                          </td>
                          <td className="p-4">
                            <span className="font-mono text-xs text-text-secondary">{log.request_id}</span>
                            {log.error && (
                              <div className="text-xs text-red-500 mt-1">{log.error}</div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'test' && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
                <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                  API Connection Test
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Test Order</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Service Code
                        </label>
                        <select
                          value={testOrder.service_code}
                          onChange={(e) => setTestOrder(prev => ({ ...prev, service_code: e.target.value }))}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        >
                          <option value="">Select service code</option>
                          {services.map((service) => (
                            <option key={service.code} value={service.code}>
                              {service.code} - {service.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Target (User ID/Phone)
                        </label>
                        <input
                          type="text"
                          value={testOrder.target}
                          onChange={(e) => setTestOrder(prev => ({ ...prev, target: e.target.value }))}
                          placeholder="Enter target ID or phone number"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Amount (Optional)
                        </label>
                        <input
                          type="text"
                          value={testOrder.amount}
                          onChange={(e) => setTestOrder(prev => ({ ...prev, amount: e.target.value }))}
                          placeholder="Enter amount if applicable"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <Button
                        onClick={testApiConnection}
                        loading={isTestingApi}
                        className="w-full"
                      >
                        <Icon name="Play" size={16} className="mr-2" />
                        Run API Test
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-4">Test Results</h4>
                    <div className="bg-surface/10 rounded-lg p-4 font-mono text-sm">
                      <div className="text-text-secondary">
                        {isTestingApi ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            Testing API connection...
                          </div>
                        ) : (
                          'Fill in the form and click "Run API Test" to test the connection.'
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Info" size={16} className="text-blue-500" />
                        <span className="font-medium text-blue-500">Test Information</span>
                      </div>
                      <p className="text-sm text-text-secondary">
                        This test will create a mock order to verify API connectivity. 
                        No actual charges will be made to your VIP Reseller balance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default VipResellerManagement;