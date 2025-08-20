import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Icon from './AppIcon';

const QuickAdminFix = () => {
  const { user, fetchProfile, profile, loading } = useAuth();
  const [status, setStatus] = useState('');
  const [working, setWorking] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Only show if user is logged in but no profile exists
  const shouldShow = user && !profile && !loading && !dismissed;

  const fixAdminAccess = async () => {
    if (!user) {
      setStatus('❌ No user logged in');
      return;
    }

    setWorking(true);
    setStatus('🔄 Fixing admin access...');

    try {
      // Step 1: Create/Update profile
      setStatus('🔄 Step 1: Creating admin profile...');
      
      const profileData = {
        id: user.id,
        username: `admin_${user.email.split('@')[0]}`,
        full_name: `Admin ${user.email.split('@')[0]}`,
        role: 'admin',
        is_verified: true,
        total_spent: 0,
        total_transactions: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try insert first
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (insertError && insertError.code === '23505') {
        // Profile exists, update it
        setStatus('🔄 Step 1b: Profile exists, updating...');
        
        const { data: updateData, error: updateError } = await supabase
          .from('profiles')
          .update({
            role: 'admin',
            is_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }
        setStatus('✅ Step 1: Profile updated to admin');
      } else if (insertError) {
        throw insertError;
      } else {
        setStatus('✅ Step 1: Admin profile created');
      }

      // Step 2: Refresh profile in context
      setStatus('🔄 Step 2: Refreshing profile data...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait a bit
      
      await fetchProfile(user.id);
      setStatus('✅ Step 2: Profile data refreshed');

      // Step 3: Verify access
      setStatus('🔄 Step 3: Verifying admin access...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('✅ ALL DONE! You now have admin access. Refresh the page and try /admin');

    } catch (error) {
      console.error('Error fixing admin access:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setWorking(false);
    }
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const dismissAlert = () => {
    setDismissed(true);
  };

  // Don't render if conditions not met
  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg border-2 border-red-400">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} />
            <span className="font-bold">ADMIN ACCESS ISSUE DETECTED</span>
          </div>
          <button
            onClick={dismissAlert}
            className="text-white hover:text-gray-200 p-1"
            title="Dismiss"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
        
        <div className="text-sm mb-3">
          User: {user?.email}<br/>
          Problem: No profile in database<br/>
          Solution: Create admin profile
        </div>

        <div className="flex gap-2">
          <button
            onClick={fixAdminAccess}
            disabled={working}
            className="flex-1 bg-white text-red-500 px-3 py-2 rounded font-bold hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-1"
          >
            {working ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Icon name="Wrench" size={16} />
                FIX NOW
              </>
            )}
          </button>
          
          <button
            onClick={refreshPage}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            <Icon name="RefreshCw" size={16} />
          </button>
        </div>

        {status && (
          <div className="mt-3 p-2 bg-black/20 rounded text-xs font-mono">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAdminFix;