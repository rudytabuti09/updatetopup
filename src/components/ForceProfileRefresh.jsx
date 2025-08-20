import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'

const ForceProfileRefresh = () => {
  const { user, profile, refreshProfile, isAdmin } = useAuth()
  const [loading, setLoading] = useState(false)
  const [dbProfile, setDbProfile] = useState(null)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      await refreshProfile()
      console.log('Profile refreshed successfully')
    } catch (error) {
      console.error('Error refreshing profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkDatabaseProfile = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        console.error('Error fetching DB profile:', error)
        setDbProfile({ error: error.message })
      } else {
        console.log('DB Profile:', data)
        setDbProfile(data)
      }
    } catch (error) {
      console.error('Error:', error)
      setDbProfile({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const forceUpdateRole = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      // Force update role to admin if email contains admin
      const newRole = user.email?.includes('admin') || user.email?.includes('tsaga') ? 'admin' : 'customer'
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating role:', error)
      } else {
        console.log('Role updated:', data)
        await refreshProfile()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please login first to test profile refresh</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Profile Debug & Refresh</h3>
      
      {/* Current Profile Info */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700">Current Profile (from AuthContext):</h4>
        <div className="bg-gray-50 p-3 rounded text-sm">
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Profile Role:</strong> {profile?.role || 'null'}</p>
          <p><strong>Is Admin:</strong> {isAdmin ? 'Yes' : 'No'}</p>
          <p><strong>Profile Data:</strong> {profile ? 'Loaded' : 'null'}</p>
        </div>
      </div>

      {/* Database Profile Info */}
      {dbProfile && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-700">Database Profile (Direct Query):</h4>
          <div className="bg-blue-50 p-3 rounded text-sm">
            {dbProfile.error ? (
              <p className="text-red-600"><strong>Error:</strong> {dbProfile.error}</p>
            ) : (
              <>
                <p><strong>DB Role:</strong> {dbProfile.role}</p>
                <p><strong>DB Username:</strong> {dbProfile.username}</p>
                <p><strong>DB Full Name:</strong> {dbProfile.full_name}</p>
                <p><strong>DB Is Verified:</strong> {dbProfile.is_verified ? 'Yes' : 'No'}</p>
                <p><strong>DB Updated At:</strong> {new Date(dbProfile.updated_at).toLocaleString()}</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh Profile'}
        </button>
        
        <button
          onClick={checkDatabaseProfile}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check DB Profile'}
        </button>
        
        <button
          onClick={forceUpdateRole}
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Force Update Role'}
        </button>
      </div>

      {/* Admin Test */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-2">Admin Access Test:</h4>
        {isAdmin ? (
          <div className="p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">✅ Admin access detected! You should be able to access /admin</p>
            <a 
              href="/admin" 
              className="inline-block mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Go to Admin Panel
            </a>
          </div>
        ) : (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-red-800">❌ No admin access. Role: {profile?.role || 'unknown'}</p>
            <p className="text-sm text-red-600 mt-1">
              Try clicking "Force Update Role" if your email contains "admin" or "tsaga"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForceProfileRefresh