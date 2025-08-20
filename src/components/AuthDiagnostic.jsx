import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Icon from './AppIcon';

const AuthDiagnostic = () => {
  const { user, profile, loading } = useAuth();
  const [diagnostics, setDiagnostics] = useState({});
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Check Supabase connection
      results.supabaseConnection = 'Testing...';
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        results.supabaseConnection = error ? `❌ Error: ${error.message}` : '✅ Connected';
      } catch (err) {
        results.supabaseConnection = `❌ Connection failed: ${err.message}`;
      }

      // Test 2: Check auth session
      results.authSession = 'Testing...';
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        results.authSession = error ? `❌ Error: ${error.message}` : 
                             session ? '✅ Session exists' : '❌ No session';
      } catch (err) {
        results.authSession = `❌ Session check failed: ${err.message}`;
      }

      // Test 3: Check user data
      results.userData = user ? '✅ User data loaded' : '❌ No user data';

      // Test 4: Direct profile query
      if (user) {
        results.profileQuery = 'Testing...';
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) {
            results.profileQuery = `❌ Query error: ${error.message}`;
            results.profileData = null;
          } else {
            results.profileQuery = '✅ Profile query successful';
            results.profileData = data;
          }
        } catch (err) {
          results.profileQuery = `❌ Query failed: ${err.message}`;
        }
      }

      // Test 5: Check RLS policies
      results.rlsCheck = 'Testing...';
      try {
        const { data, error } = await supabase.rpc('check_user_access');
        results.rlsCheck = error ? `❌ RLS Error: ${error.message}` : '✅ RLS OK';
      } catch (err) {
        results.rlsCheck = `⚠️ RLS check unavailable: ${err.message}`;
      }

      // Test 6: Environment variables
      results.envVars = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Missing',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'
      };

    } catch (error) {
      results.generalError = `❌ Diagnostic failed: ${error.message}`;
    }

    setDiagnostics(results);
    setTesting(false);
  };

  useEffect(() => {
    if (user && !profile && !loading) {
      runDiagnostics();
    }
  }, [user, profile, loading]);

  const createProfileManually = async () => {
    if (!user) return;

    setTesting(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: `user_${user.email.split('@')[0]}`,
          full_name: user.email.split('@')[0],
          role: 'admin', // Set as admin for testing
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        alert(`Error creating profile: ${error.message}`);
      } else {
        alert('Profile created successfully! Refreshing...');
        window.location.reload();
      }
    } catch (err) {
      alert(`Failed to create profile: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  // Only show if there's an auth issue
  if (!user || profile || loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl border border-border shadow-gaming-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="AlertTriangle" size={24} className="text-red-500" />
            <div>
              <h2 className="text-xl font-gaming font-bold text-foreground">
                Authentication Diagnostic
              </h2>
              <p className="text-text-secondary text-sm">
                Detecting authentication and profile issues
              </p>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-surface/10 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-foreground mb-2">Current User:</h3>
            <div className="text-sm space-y-1">
              <div>Email: {user?.email}</div>
              <div>ID: <code className="text-xs">{user?.id}</code></div>
              <div>Created: {user?.created_at}</div>
            </div>
          </div>

          {/* Diagnostics Results */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-foreground">Diagnostic Results:</h3>
            
            {Object.entries(diagnostics).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start p-2 bg-surface/5 rounded">
                <span className="text-sm font-medium text-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:
                </span>
                <span className="text-sm text-right max-w-xs">
                  {typeof value === 'object' ? (
                    <div className="space-y-1">
                      {Object.entries(value).map(([k, v]) => (
                        <div key={k}>{k}: {v}</div>
                      ))}
                    </div>
                  ) : (
                    value
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Profile Data */}
          {diagnostics.profileData && (
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Profile Data Found:</h3>
              <pre className="text-xs bg-surface/20 p-3 rounded overflow-auto max-h-32">
                {JSON.stringify(diagnostics.profileData, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={runDiagnostics}
              disabled={testing}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Run Diagnostics'}
            </button>
            
            <button
              onClick={createProfileManually}
              disabled={testing}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Create Admin Profile
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-foreground hover:bg-surface/80 transition-colors"
            >
              Refresh Page
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">Troubleshooting Steps:</h4>
            <ol className="text-sm text-text-secondary space-y-1 list-decimal list-inside">
              <li>Check if Supabase connection is working</li>
              <li>Verify environment variables are set</li>
              <li>Check if profile exists in database</li>
              <li>Create profile manually if needed</li>
              <li>Check Row Level Security policies</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDiagnostic;