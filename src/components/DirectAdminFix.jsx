import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from './AppIcon';

const DirectAdminFix = () => {
  const { user, profile, loading } = useAuth();
  const [step, setStep] = useState(0);

  const steps = [
    'Click to start fix',
    'Clearing browser cache...',
    'Refreshing session...',
    'Reloading page...'
  ];

  const directFix = async () => {
    if (!user) return;

    try {
      // Step 1: Clear cache
      setStep(1);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Clear localStorage and sessionStorage
      setStep(2);
      localStorage.clear();
      sessionStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 3: Force reload
      setStep(3);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force hard reload
      window.location.href = window.location.href;
      
    } catch (error) {
      console.error('Direct fix error:', error);
      // Fallback: just reload
      window.location.reload();
    }
  };

  // Only show if user exists but no profile and not loading
  if (!user || profile || loading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 border border-border shadow-gaming-lg max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="AlertTriangle" size={32} className="text-red-500" />
          </div>
          
          <h2 className="text-xl font-gaming font-bold text-foreground mb-2">
            Profile Loading Issue
          </h2>
          
          <p className="text-text-secondary mb-6">
            Your profile exists in the database but can't be loaded. 
            This is likely a browser cache or session issue.
          </p>

          <div className="bg-surface/10 rounded-lg p-4 mb-6">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>User:</span>
                <span className="font-mono text-xs">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Profile Status:</span>
                <span className="text-red-500">Not Loaded</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Role:</span>
                <span className="text-green-500">Admin</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-text-secondary mb-2">
              Fix Progress:
            </div>
            <div className="text-primary font-medium">
              {steps[step]}
            </div>
            {step > 0 && (
              <div className="w-full bg-surface/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                />
              </div>
            )}
          </div>

          <button
            onClick={directFix}
            disabled={step > 0}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-lg font-gaming font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {step > 0 ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Icon name="Wrench" size={20} />
                Fix Profile Issue
              </>
            )}
          </button>

          <div className="mt-4 text-xs text-text-secondary">
            This will clear browser cache and reload the page
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectAdminFix;