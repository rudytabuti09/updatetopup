import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper functions for common operations
export const supabaseHelpers = {
  // Auth helpers
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  async updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  },

  // Games helpers
  async getGames(filters = {}) {
    let query = supabase
      .from('games')
      .select(`
        *,
        game_packages(*)
      `)
      .eq('is_active', true)

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    if (filters.isPopular) {
      query = query.eq('is_popular', true)
    }

    // Sorting
    switch (filters.sortBy) {
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'price-low':
        query = query.order('min_price', { ascending: true })
        break
      case 'price-high':
        query = query.order('max_price', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      default: // popular
        query = query.order('review_count', { ascending: false })
    }

    const { data, error } = await query
    return { data, error }
  },

  async getGameBySlug(slug) {
    const { data, error } = await supabase
      .from('games')
      .select(`
        *,
        game_packages(*),
        reviews(
          *,
          profiles(username, avatar_url)
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    return { data, error }
  },

  async getGamePackages(gameId) {
    const { data, error } = await supabase
      .from('game_packages')
      .select('*')
      .eq('game_id', gameId)
      .eq('is_active', true)
      .order('sort_order')

    return { data, error }
  },

  // Promotions helpers
  async getActivePromotions() {
    const { data, error } = await supabase
      .from('promotions')
      .select(`
        *,
        games(name, slug, icon_url)
      `)
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Transactions helpers
  async createTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        transaction_code: `WMX${Date.now()}${Math.floor(Math.random() * 1000)}`
      }])
      .select()
      .single()

    return { data, error }
  },

  async getUserTransactions(userId, limit = 10) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        games(name, icon_url),
        game_packages(name, amount)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  async updateTransactionStatus(transactionId, status, notes = null) {
    const updates = { 
      status,
      updated_at: new Date().toISOString()
    }

    if (status === 'processing') {
      updates.processed_at = new Date().toISOString()
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString()
    }

    if (notes) {
      updates.notes = notes
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single()

    return { data, error }
  },

  // Reviews helpers
  async createReview(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()

    return { data, error }
  },

  async getGameReviews(gameId, limit = 10) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles(username, avatar_url)
      `)
      .eq('game_id', gameId)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  // User favorites helpers
  async addToFavorites(gameId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert([{ user_id: user.id, game_id: gameId }])
      .select()
      .single()

    return { data, error }
  },

  async removeFromFavorites(gameId) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not authenticated' }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('game_id', gameId)

    return { error }
  },

  async getUserFavorites() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: [], error: null }

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        *,
        games(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Payment methods helpers
  async getPaymentMethods() {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    return { data, error }
  },

  // User preferences helpers
  async getUserPreferences() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    return { data, error }
  },

  async updateUserPreferences(preferences) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'User not authenticated' }

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert([{ 
        user_id: user.id, 
        ...preferences,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    return { data, error }
  },

  // System settings helpers
  async getPublicSettings() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .eq('is_public', true)

    // Convert to object for easier access
    const settings = {}
    if (data) {
      data.forEach(setting => {
        settings[setting.key] = setting.value
      })
    }

    return { data: settings, error }
  }
}

export default supabase