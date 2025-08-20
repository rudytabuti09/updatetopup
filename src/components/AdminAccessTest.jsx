import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';

const AdminAccessTest = () => {
  const { user, profile, loading, fetchProfile } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleRefreshProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      await fetchProfile(user.id);
      setTestResult('Profile refreshed successfully');
    } catch (error) {
      setTestResult(`Error refreshing profile: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleMakeAdmin = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchProfile(user.id);
      setTestResult('Successfully updated to admin role!');
    } catch (error) {
      setTestResult(`Error updating role: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const testAdminAccess = () => {
    const hasAdminRole = profile?.role === 'admin' || profile?.role === 'moderator';
    setTestResult(`Admin Access Test: ${hasAdminRole ? 'PASS ✅' : 'FAIL ❌'}`);
  };

  if (!user) {
    return (
      <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
        <h3 className="text-lg font-gaming font-bold text-foreground mb-4">
          Admin Access Test
        </h3>
        <p className="text-text-secondary">Please login to test admin access.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-gaming">
      <h3 className="text-lg font-gaming font-bold text-foreground mb-4">
        🔧 Admin Access Test & Debug
      </h3>
      
      {/* User Info */}
      <div className="bg-surface/10 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-foreground mb-2">Current User Info:</h4>
        <div className="space-y-1 text-sm">
          <div>Email: <span className="font-mono">{user.email}</span></div>
          <div>User ID: <span className="font-mono text-xs">{user.id}</span></div>
          <div>Profile Loaded: {profile ? '✅' : '❌'}</div>
          <div>Current Role: <span className="font-mono">{profile?.role || 'None'}</span></div>
          <div>Is Verified: {profile?.is_verified ? '✅' : '❌'}</div>
          <div>Loading: {loading ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button 
            onClick={handleRefreshProfile} 
            loading={updating}
            variant="outline"
            size="sm"
          >
            <Icon name="RefreshCw" size={14} className="mr-2" />
            Refresh Profile
          </Button>
          
          <Button 
            onClick={testAdminAccess}
            variant="outline"
            size="sm"
          >
            <Icon name="Shield" size={14} className="mr-2" />
            Test Access
          </Button>
        </div>

        {/* Make Admin Button (for testing) */}
        {profile?.role !== 'admin' && (
          <Button 
            onClick={handleMakeAdmin} 
            loading={updating}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="sm"
          >
            <Icon name="Crown" size={14} className="mr-2" />
            Make This User Admin (TEST)
          </Button>
        )}

        {/* Admin Panel Link */}
        {(profile?.role === 'admin' || profile?.role === 'moderator') && (
          <Link to="/admin">
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <Icon name="Shield" size={16} className="mr-2" />
              Access Admin Panel
            </Button>
          </Link>
        )}
      </div>

      {/* Test Result */}
      {testResult && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="text-sm font-mono text-blue-400">{testResult}</div>
        </div>
      )}

      {/* Debug Info */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-text-secondary hover:text-foreground">
          Show Raw Profile Data
        </summary>
        <pre className="mt-2 p-3 bg-surface/20 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify({ user: user, profile: profile }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default AdminAccessTest;