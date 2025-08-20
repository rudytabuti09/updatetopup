import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';

const SupabaseConnectionTest = () => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [profileStatus, setProfileStatus] = useState('testing');
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, [user]);

  const testConnection = async () => {
    try {
      // Test 1: Basic Supabase connection
      setConnectionStatus('testing');
      const { data, error: connError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (connError) {
        setConnectionStatus('failed');
        setError(`Connection Error: ${connError.message}`);
        return;
      }
      
      setConnectionStatus('success');

      // Test 2: Profile access if user is logged in
      if (user) {
        setProfileStatus('testing');
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setProfileStatus('not_found');
            setError('Profile not found in database');
          } else {
            setProfileStatus('failed');
            setError(`Profile Error: ${profileError.message}`);
          }
        } else {
          setProfileStatus('success');
          setError(null);
        }
      } else {
        setProfileStatus('no_user');
      }

    } catch (err) {
      setConnectionStatus('failed');
      setError(`Test Failed: ${err.message}`);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: `admin_${user.email.split('@')[0]}`,
          full_name: `Admin ${user.email.split('@')[0]}`,
          role: 'admin',
          is_verified: true,
          total_spent: 0,
          total_transactions: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('Profile created! Refreshing page...');
        window.location.reload();
      }
    } catch (err) {
      alert(`Failed: ${err.message}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'failed': return { icon: 'XCircle', color: 'text-red-500' };
      case 'testing': return { icon: 'Loader2', color: 'text-blue-500 animate-spin' };
      case 'not_found': return { icon: 'AlertCircle', color: 'text-yellow-500' };
      case 'no_user': return { icon: 'User', color: 'text-gray-500' };
      default: return { icon: 'HelpCircle', color: 'text-gray-500' };
    }
  };

  // Only show if there are issues
  if (connectionStatus === 'success' && profileStatus === 'success') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border border-border rounded-lg shadow-gaming p-4 max-w-sm z-40">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Database" size={16} className="text-primary" />
        <span className="font-semibold text-foreground text-sm">Supabase Status</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Connection:</span>
          <div className="flex items-center gap-1">
            <Icon 
              name={getStatusIcon(connectionStatus).icon} 
              size={14} 
              className={getStatusIcon(connectionStatus).color} 
            />
            <span className={getStatusIcon(connectionStatus).color}>
              {connectionStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Profile:</span>
          <div className="flex items-center gap-1">
            <Icon 
              name={getStatusIcon(profileStatus).icon} 
              size={14} 
              className={getStatusIcon(profileStatus).color} 
            />
            <span className={getStatusIcon(profileStatus).color}>
              {profileStatus === 'not_found' ? 'missing' : profileStatus}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400">
          {error}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button
          onClick={testConnection}
          className="flex-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-medium transition-colors"
        >
          Retry
        </button>
        
        {profileStatus === 'not_found' && user && (
          <button
            onClick={createProfile}
            className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium transition-colors"
          >
            Create
          </button>
        )}
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;