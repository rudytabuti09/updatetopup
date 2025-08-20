import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AdminHeader = ({ user, profile, onRefresh }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { showSuccess } = useNotification();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess('Logged out successfully', 'Goodbye!');
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} className="text-black" />
            </div>
            <div>
              <h1 className="text-xl font-gaming font-bold text-gaming-gradient">
                WMX ADMIN
              </h1>
              <p className="text-xs text-text-secondary">Control Panel</p>
            </div>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Icon 
              name="Search" 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Search users, transactions, games..."
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-foreground placeholder-text-secondary focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Actions & User Menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-surface/50 rounded-lg transition-colors">
            <Icon name="Bell" size={20} className="text-text-secondary" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Quick Actions */}
          <button 
            onClick={onRefresh}
            className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
            title="Refresh Data"
          >
            <Icon name="RefreshCw" size={20} className="text-text-secondary" />
          </button>

          {/* Settings */}
          <Link 
            to="/admin/settings"
            className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
            title="Settings"
          >
            <Icon name="Settings" size={20} className="text-text-secondary" />
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 hover:bg-surface/50 rounded-lg transition-colors"
            >
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile?.full_name || profile?.username}
                  className="w-8 h-8 rounded-full border-2 border-primary"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-black">
                    {(profile?.full_name || profile?.username || 'A').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium text-foreground">
                  {profile?.full_name || profile?.username || 'Admin'}
                </div>
                <div className="text-xs text-text-secondary">
                  {profile?.role || 'Administrator'}
                </div>
              </div>
              <Icon name="ChevronDown" size={16} className="text-text-secondary" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-gaming-lg z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={profile?.full_name || profile?.username}
                        className="w-12 h-12 rounded-full border-2 border-primary"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-black">
                          {(profile?.full_name || profile?.username || 'A').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground">
                        {profile?.full_name || profile?.username || 'Admin'}
                      </div>
                      <div className="text-sm text-text-secondary">{user?.email}</div>
                      <div className="text-xs text-primary font-medium">
                        {profile?.role || 'Administrator'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/admin/profile"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface/50 rounded-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="User" size={16} className="text-text-secondary" />
                    <span className="text-foreground">Profile Settings</span>
                  </Link>
                  
                  <Link
                    to="/admin/security"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface/50 rounded-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="Shield" size={16} className="text-text-secondary" />
                    <span className="text-foreground">Security</span>
                  </Link>
                  
                  <Link
                    to="/admin/activity"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface/50 rounded-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="Activity" size={16} className="text-text-secondary" />
                    <span className="text-foreground">Activity Log</span>
                  </Link>

                  <hr className="my-2 border-border" />

                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-surface/50 rounded-lg transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Icon name="ExternalLink" size={16} className="text-text-secondary" />
                    <span className="text-foreground">View Site</span>
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                  >
                    <Icon name="LogOut" size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
};

export default AdminHeader;