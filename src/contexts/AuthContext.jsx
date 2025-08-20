import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseHelpers } from '../utils/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true
    let timeoutId = null

    // Emergency timeout - force loading to false after 800ms
    const emergencyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.log('AuthContext: EMERGENCY TIMEOUT - forcing loading to false')
        setLoading(false)
        setAuthChecked(true)
      }
    }, 800)

    // Get initial session with aggressive timeout
    const getInitialSession = async () => {
      try {
        console.log('AuthContext: Getting initial session...')

        // Set a shorter timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('AuthContext: Session check timeout (1s), forcing loading to false')
            setLoading(false)
            setAuthChecked(true)
            setUser(null)
            setProfile(null)
            setSession(null)
          }
        }, 1000) // 1 second timeout

        const sessionPromise = supabase.auth.getSession()
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 800)
          )
        ])

        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }

        if (emergencyTimeout) {
          clearTimeout(emergencyTimeout)
        }

        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          setAuthChecked(true)
          return
        }

        console.log('AuthContext: Initial session:', session ? 'Found' : 'None')
        setSession(session)
        setUser(session?.user ?? null)
        setAuthChecked(true)

        if (session?.user) {
          // Don't await profile fetch to avoid blocking
          fetchProfile(session.user.id).catch(err => {
            console.error('Profile fetch failed:', err)
          })
        }

        setLoading(false)
      } catch (error) {
        console.error('AuthContext: Error in getInitialSession:', error)
        if (mounted) {
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          if (emergencyTimeout) {
            clearTimeout(emergencyTimeout)
          }
          setLoading(false)
          setAuthChecked(true)
          setUser(null)
          setProfile(null)
          setSession(null)
        }
      }
    }

    // Start session check immediately
    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return

        console.log('AuthContext: Auth state changed:', event, session ? 'User present' : 'No user')
        setSession(session)
        setUser(session?.user ?? null)
        setAuthChecked(true)

        if (session?.user) {
          // Don't await to avoid blocking
          fetchProfile(session.user.id).catch(err => {
            console.error('Profile fetch failed in auth change:', err)
          })
        } else {
          setProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      mounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (emergencyTimeout) {
        clearTimeout(emergencyTimeout)
      }
      subscription?.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId, forceRefresh = false) => {
    try {
      console.log('AuthContext: Fetching profile for user ID:', userId, forceRefresh ? '(force refresh)' : '')
      
      // Add timestamp to force fresh data
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
      
      if (forceRefresh) {
        // Add a random parameter to bypass cache
        query.limit(1)
      }
      
      const { data, error } = await query.single()

      if (error) {
        console.error('AuthContext: Error fetching profile:', error)
        
        // If profile doesn't exist, try to create one
        if (error.code === 'PGRST116') {
          console.log('AuthContext: Profile not found, will be created by trigger...')
          // Don't create profile manually, let the trigger handle it
          // Just set null and let the app handle the loading state
          setProfile(null)
        } else {
          console.error('AuthContext: Database error fetching profile:', error)
          // Don't set fallback profile, keep it null to show error state
          setProfile(null)
        }
        return
      }

      console.log('AuthContext: Profile fetched successfully:', data)
      console.log('AuthContext: User role is:', data.role)
      setProfile(data)
    } catch (error) {
      console.error('AuthContext: Error in fetchProfile:', error)
      // Don't set fallback profile, keep it null
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      console.log('AuthContext: Manually refreshing profile...')
      await fetchProfile(user.id, true)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseHelpers.signUp(email, password, userData)

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await supabaseHelpers.signIn(email, password)

      if (error) {
        throw error
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabaseHelpers.signOut()

      if (error) {
        throw error
      }

      setUser(null)
      setProfile(null)
      setSession(null)

      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }

      // Update auth user data
      const { data: authData, error: authError } = await supabaseHelpers.updateProfile(updates)

      if (authError) {
        throw authError
      }

      // Update profile table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (profileError) {
        throw profileError
      }

      setProfile(profileData)
      return { data: profileData, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { error }
    }
  }

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (error) {
      console.error('Error updating password:', error)
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    fetchProfile,
    refreshProfile,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isModerator: profile?.role === 'moderator' || profile?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}