import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Icon from './AppIcon';

const InstantAdminFix = () => {
  const { user, profile } = useAuth();
  const [fixing, setFixing] = useState(false);

  const instantFix = async () => {
    if (!user) return;

    setFixing(true);
    
    try {
      // Force reload AuthContext by triggering a re-authentication
      console.log('Forcing auth refresh...');
      
      // Method 1: Force refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
      } else {
        console.log('Session refreshed:', session);
      }

      // Method 2: Trigger auth state change manually
      window.dispatchEvent(new Event('supabase:auth-change'));
      
      // Method 3: Force page reload after a short delay
      setTimeout(() => {
        console.log('Force reloading page...');
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Fix failed:', error);
      // Fallback: just reload the page
      window.location.reload();
    }
  };

  // Only show if user exists but no profile
  if (!user || profile) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg border-2 border-red-400 max-w-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icon name="Zap" size={20} />
            <span className="font-bold">QUICK FIX</span>
          </div>
          
          <div className="text-sm mb-3">
            Profile not loading. Click to fix instantly.
          </div>

          <button
            onClick={instantFix}
            disabled={fixing}
            className="w-full bg-white text-red-500 px-4 py-2 rounded font-bold hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {fixing ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Icon name="Zap" size={16} />
                FIX NOW
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstantAdminFix;