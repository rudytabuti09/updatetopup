import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const AdminDebug = () => {
  const { user, profile, loading, isAdmin, isModerator } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="font-bold mb-2">🔍 Admin Debug Info</div>
      <div className="space-y-1">
        <div>Loading: {loading ? '✅' : '❌'}</div>
        <div>User: {user ? '✅' : '❌'}</div>
        <div>User ID: {user?.id || 'None'}</div>
        <div>User Email: {user?.email || 'None'}</div>
        <div>Profile: {profile ? '✅' : '❌'}</div>
        <div>Profile Role: {profile?.role || 'None'}</div>
        <div>Is Admin: {isAdmin ? '✅' : '❌'}</div>
        <div>Is Moderator: {isModerator ? '✅' : '❌'}</div>
        <div className="mt-2 pt-2 border-t border-gray-600">
          <div className="font-bold">Profile Data:</div>
          <pre className="text-xs overflow-auto max-h-32">
            {profile ? JSON.stringify(profile, null, 2) : 'No profile data'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AdminDebug;