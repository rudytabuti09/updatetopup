import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

const SimpleAdminFix = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        setMessage(`Session Error: ${sessionError.message}`)
        setLoading(false)
        return
      }

      if (!session) {
        setMessage('No active session - please login')
        setLoading(false)
        return
      }

      setUser(session.user)
      setMessage(`User found: ${session.user.email}`)

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        setMessage(`Profile Error: ${profileError.message}`)
      } else {
        setProfile(profileData)
        setMessage(`Profile loaded - Role: ${profileData.role}`)
      }

    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const forceAdminRole = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          role: 'admin',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) {
        setMessage(`Update Error: ${error.message}`)
      } else {
        setProfile(data)
        setMessage(`Success! Role updated to: ${data.role}`)
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testAdminAccess = () => {
    if (profile?.role === 'admin') {
      window.location.href = '/admin'
    } else {
      setMessage('Not admin - cannot access admin panel')
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-sm">
      <h3 className="font-bold text-lg mb-3">🔧 Admin Fix Tool</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>Status:</strong> {loading ? 'Loading...' : 'Ready'}</p>
        <p><strong>User:</strong> {user?.email || 'None'}</p>
        <p><strong>Role:</strong> {profile?.role || 'None'}</p>
        <p className="text-blue-600">{message}</p>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button
          onClick={checkAuth}
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
        >
          Refresh Auth
        </button>
        
        <button
          onClick={forceAdminRole}
          disabled={loading || !user}
          className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
        >
          Force Admin Role
        </button>
        
        <button
          onClick={testAdminAccess}
          disabled={loading || profile?.role !== 'admin'}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50"
        >
          Test Admin Access
        </button>
      </div>
    </div>
  )
}

export default SimpleAdminFix