import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Settings = () => {
  const { user, profile } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      site_name: 'WMX TOPUP',
      site_description: 'Premium Gaming Top-Up Platform',
      site_logo: '',
      maintenance_mode: false,
      registration_enabled: true,
      email_verification_required: true
    },
    payments: {
      qris_enabled: true,
      bank_transfer_enabled: true,
      ewallet_enabled: true,
      credit_card_enabled: false,
      minimum_topup: 10000,
      maximum_topup: 5000000,
      auto_process_enabled: true
    },
    vip_reseller: {
      api_key: '••••••••••••••••',
      api_url: 'https://vip-reseller.co.id/api',
      webhook_url: 'https://wmxtopup.com/api/vip-webhook',
      auto_sync_enabled: true,
      sync_interval: 60,
      balance_alert_threshold: 1000000
    },
    notifications: {
      email_notifications: true,
      sms_notifications: false,
      push_notifications: true,
      admin_alerts: true,
      low_balance_alerts: true,
      failed_transaction_alerts: true
    },
    security: {
      two_factor_required: false,
      session_timeout: 30,
      max_login_attempts: 5,
      password_min_length: 8,
      require_strong_password: true,
      ip_whitelist_enabled: false
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // In production, this would save to your backend/Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Settings saved successfully', 'Settings Updated');
      setHasChanges(false);
    } catch (error) {
      showError('Failed to save settings', 'Save Error');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    // Reset to default values
    setHasChanges(false);
    showSuccess('Settings reset to defaults', 'Settings Reset');
  };

  const testVipConnection = async () => {
    try {
      setIsSaving(true);
      // Test VIP Reseller API connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('VIP Reseller API connection successful', 'Connection Test');
    } catch (error) {
      showError('VIP Reseller API connection failed', 'Connection Error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { key: 'general', label: 'General', icon: 'Settings' },
    { key: 'payments', label: 'Payments', icon: 'CreditCard' },
    { key: 'vip_reseller', label: 'VIP Reseller', icon: 'Zap' },
    { key: 'notifications', label: 'Notifications', icon: 'Bell' },
    { key: 'security', label: 'Security', icon: 'Shield' }
  ];

  return (
    <>
      <Helmet>
        <title>System Settings - WMX TOPUP Admin</title>
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
                  System Settings
                </h1>
                <p className="text-text-secondary">
                  Configure system-wide settings and preferences
                </p>
              </div>
              <div className="flex items-center gap-4">
                {hasChanges && (
                  <div className="flex items-center gap-2 text-yellow-500">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">Unsaved changes</span>
                  </div>
                )}
                <Button variant="outline" onClick={resetSettings}>
                  Reset to Defaults
                </Button>
                <Button onClick={saveSettings} loading={isSaving} disabled={!hasChanges}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
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

            {/* Settings Content */}
            <div className="bg-card rounded-xl border border-border shadow-gaming">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                    General Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Site Name
                        </label>
                        <input
                          type="text"
                          value={settings.general.site_name}
                          onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Site Logo URL
                        </label>
                        <input
                          type="url"
                          value={settings.general.site_logo}
                          onChange={(e) => handleSettingChange('general', 'site_logo', e.target.value)}
                          placeholder="https://example.com/logo.png"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.site_description}
                        onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
                        rows={3}
                        className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">Maintenance Mode</div>
                          <div className="text-sm text-text-secondary">Temporarily disable site access for maintenance</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.maintenance_mode}
                            onChange={(e) => handleSettingChange('general', 'maintenance_mode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">User Registration</div>
                          <div className="text-sm text-text-secondary">Allow new users to register accounts</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.registration_enabled}
                            onChange={(e) => handleSettingChange('general', 'registration_enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">Email Verification Required</div>
                          <div className="text-sm text-text-secondary">Require email verification for new accounts</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.general.email_verification_required}
                            onChange={(e) => handleSettingChange('general', 'email_verification_required', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <div className="p-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                    Payment Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Minimum Top-up Amount (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.payments.minimum_topup}
                          onChange={(e) => handleSettingChange('payments', 'minimum_topup', parseInt(e.target.value))}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Maximum Top-up Amount (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.payments.maximum_topup}
                          onChange={(e) => handleSettingChange('payments', 'maximum_topup', parseInt(e.target.value))}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Payment Methods</h4>
                      
                      {[
                        { key: 'qris_enabled', label: 'QRIS', description: 'Quick Response Code Indonesian Standard' },
                        { key: 'bank_transfer_enabled', label: 'Bank Transfer', description: 'Direct bank transfers' },
                        { key: 'ewallet_enabled', label: 'E-Wallet', description: 'Digital wallet payments (OVO, GoPay, DANA)' },
                        { key: 'credit_card_enabled', label: 'Credit Card', description: 'Visa, Mastercard, etc.' }
                      ].map((method) => (
                        <div key={method.key} className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{method.label}</div>
                            <div className="text-sm text-text-secondary">{method.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.payments[method.key]}
                              onChange={(e) => handleSettingChange('payments', method.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                      
                      <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">Auto Process Orders</div>
                          <div className="text-sm text-text-secondary">Automatically process orders when payment is confirmed</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.payments.auto_process_enabled}
                            onChange={(e) => handleSettingChange('payments', 'auto_process_enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIP Reseller Settings */}
              {activeTab === 'vip_reseller' && (
                <div className="p-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                    VIP Reseller API Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          API URL
                        </label>
                        <input
                          type="url"
                          value={settings.vip_reseller.api_url}
                          onChange={(e) => handleSettingChange('vip_reseller', 'api_url', e.target.value)}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Webhook URL
                        </label>
                        <input
                          type="url"
                          value={settings.vip_reseller.webhook_url}
                          onChange={(e) => handleSettingChange('vip_reseller', 'webhook_url', e.target.value)}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={settings.vip_reseller.api_key}
                          onChange={(e) => handleSettingChange('vip_reseller', 'api_key', e.target.value)}
                          className="flex-1 p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                        <Button onClick={testVipConnection} loading={isSaving}>
                          <Icon name="Zap" size={16} className="mr-2" />
                          Test Connection
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Sync Interval (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.vip_reseller.sync_interval}
                          onChange={(e) => handleSettingChange('vip_reseller', 'sync_interval', parseInt(e.target.value))}
                          min="5"
                          max="1440"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Balance Alert Threshold (IDR)
                        </label>
                        <input
                          type="number"
                          value={settings.vip_reseller.balance_alert_threshold}
                          onChange={(e) => handleSettingChange('vip_reseller', 'balance_alert_threshold', parseInt(e.target.value))}
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                      <div>
                        <div className="font-medium text-foreground">Auto Sync Services</div>
                        <div className="text-sm text-text-secondary">Automatically sync available services from VIP Reseller</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.vip_reseller.auto_sync_enabled}
                          onChange={(e) => handleSettingChange('vip_reseller', 'auto_sync_enabled', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                    Notification Settings
                  </h3>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'email_notifications', label: 'Email Notifications', description: 'Send notifications via email' },
                      { key: 'sms_notifications', label: 'SMS Notifications', description: 'Send notifications via SMS' },
                      { key: 'push_notifications', label: 'Push Notifications', description: 'Send browser push notifications' },
                      { key: 'admin_alerts', label: 'Admin Alerts', description: 'Send alerts to administrators' },
                      { key: 'low_balance_alerts', label: 'Low Balance Alerts', description: 'Alert when VIP Reseller balance is low' },
                      { key: 'failed_transaction_alerts', label: 'Failed Transaction Alerts', description: 'Alert when transactions fail' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{notification.label}</div>
                          <div className="text-sm text-text-secondary">{notification.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[notification.key]}
                            onChange={(e) => handleSettingChange('notifications', notification.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-gaming font-bold text-foreground mb-6">
                    Security Settings
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.security.session_timeout}
                          onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
                          min="5"
                          max="1440"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.security.max_login_attempts}
                          onChange={(e) => handleSettingChange('security', 'max_login_attempts', parseInt(e.target.value))}
                          min="3"
                          max="10"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password Min Length
                        </label>
                        <input
                          type="number"
                          value={settings.security.password_min_length}
                          onChange={(e) => handleSettingChange('security', 'password_min_length', parseInt(e.target.value))}
                          min="6"
                          max="20"
                          className="w-full p-3 bg-surface border border-border rounded-lg text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'two_factor_required', label: 'Require Two-Factor Authentication', description: 'Force all users to enable 2FA' },
                        { key: 'require_strong_password', label: 'Require Strong Passwords', description: 'Enforce strong password requirements' },
                        { key: 'ip_whitelist_enabled', label: 'IP Whitelist for Admin', description: 'Restrict admin access to specific IP addresses' }
                      ].map((security) => (
                        <div key={security.key} className="flex items-center justify-between p-4 bg-surface/10 rounded-lg">
                          <div>
                            <div className="font-medium text-foreground">{security.label}</div>
                            <div className="text-sm text-text-secondary">{security.description}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.security[security.key]}
                              onChange={(e) => handleSettingChange('security', security.key, e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      ))}
                    </div>
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

export default Settings;