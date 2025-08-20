import React, { useState, useEffect } from 'react'
import { useGame } from '../contexts/GameContext'
import { useAuth } from '../contexts/AuthContext'
import { supabaseHelpers } from '../utils/supabase'

// Hook untuk mengintegrasikan data Supabase dengan komponen existing
export const useSupabaseData = () => {
  const { 
    games, 
    filteredGames, 
    promotions, 
    paymentMethods, 
    systemSettings,
    filters,
    updateFilters,
    clearFilters,
    getCategories,
    getTrendingGames,
    getRecommendedGames,
    loading: gameLoading 
  } = useGame()
  
  const { user, profile, loading: authLoading } = useAuth()
  const [userPreferences, setUserPreferences] = useState(null)
  const [userFavorites, setUserFavorites] = useState([])
  const [userTransactions, setUserTransactions] = useState([])
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)

  // Force initial load to complete after timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('useSupabaseData: Force initial load complete after timeout')
      setInitialLoadComplete(true)
    }, 3000) // 3 second timeout

    return () => clearTimeout(timeout)
  }, [])

  // Mark initial load as complete when both contexts are ready
  useEffect(() => {
    if (!gameLoading && !authLoading && !initialLoadComplete) {
      console.log('useSupabaseData: Initial load complete - contexts ready')
      setInitialLoadComplete(true)
    }
  }, [gameLoading, authLoading, initialLoadComplete])

  // Load user-specific data when user is authenticated
  useEffect(() => {
    if (user && !authLoading) {
      loadUserData()
    } else {
      setUserPreferences(null)
      setUserFavorites([])
      setUserTransactions([])
    }
  }, [user, authLoading])

  const loadUserData = async () => {
    try {
      setUserDataLoaded(false)
      const [preferencesResult, favoritesResult, transactionsResult] = await Promise.all([
        supabaseHelpers.getUserPreferences(),
        supabaseHelpers.getUserFavorites(),
        supabaseHelpers.getUserTransactions(user.id, 10)
      ])

      if (preferencesResult.data) {
        setUserPreferences(preferencesResult.data)
      }
      if (favoritesResult.data) {
        setUserFavorites(favoritesResult.data)
      }
      if (transactionsResult.data) {
        setUserTransactions(transactionsResult.data)
      }
      
      setUserDataLoaded(true)
    } catch (error) {
      console.error('Error loading user data:', error)
      setUserDataLoaded(true) // Mark as loaded even on error to prevent infinite loading
    }
  }

  // Transform Supabase data to match existing component structure
  const transformGameData = (supabaseGames) => {
    return supabaseGames.map(game => ({
      id: game.id,
      name: game.name,
      category: game.category,
      image: game.image_url,
      rating: game.rating || 0,
      reviewCount: game.review_count || 0,
      isPopular: game.is_popular,
      hasPromo: promotions.some(promo => promo.game_id === game.id),
      processingSpeed: game.processing_speed,
      packages: game.game_packages?.map(pkg => ({
        amount: pkg.amount,
        price: pkg.price,
        originalPrice: pkg.original_price,
        discount: pkg.discount_percentage
      })) || [],
      topReview: game.reviews?.[0] ? {
        username: game.reviews[0].profiles?.username || 'Anonymous',
        avatar: game.reviews[0].profiles?.avatar_url || 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: game.reviews[0].rating,
        comment: game.reviews[0].comment
      } : null
    }))
  }

  const transformPromotionData = (supabasePromotions) => {
    return supabasePromotions.map(promo => ({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      badge: promo.badge,
      discount: promo.discount_percentage,
      gameName: promo.games?.name,
      gameImage: promo.games?.icon_url,
      gameIcon: promo.games?.icon_url,
      backgroundImage: promo.background_image,
      isLimited: promo.is_limited,
      endTime: promo.end_date,
      shortDescription: promo.description
    }))
  }

  // Get category icon based on category type
  const getCategoryIcon = (categoryId) => {
    const iconMap = {
      'all': 'Grid3X3',
      'moba': 'Sword',
      'battle-royale': 'Target',
      'rpg': 'Shield',
      'strategy': 'Brain',
      'racing': 'Car',
      'sports': 'Trophy',
      'casual': 'Gamepad2',
      'fps': 'Crosshair'
    }
    return iconMap[categoryId] || 'Gamepad2'
  }

  // Transform data for components
  const trendingGames = transformGameData(getTrendingGames())
  const recommendedGames = transformGameData(getRecommendedGames(userPreferences || {}))
  const allGames = transformGameData(filteredGames)
  const promoOffers = transformPromotionData(promotions)

  // Search suggestions
  const searchSuggestions = games.map(game => ({
    name: game.name,
    category: game.category,
    icon: game.icon_url,
    packageCount: game.package_count || 0
  }))

  // User preferences for recommendations
  const userPreferencesFormatted = userPreferences ? {
    favoriteGenres: userPreferences.favorite_genres || [],
    averageSpending: userPreferences.average_spending || 0,
    playTime: userPreferences.preferred_play_time || 'Malam (20:00-24:00)'
  } : {
    favoriteGenres: ['moba', 'battle-royale'],
    averageSpending: 75000,
    playTime: 'Malam (20:00-24:00)'
  }

  // Filter handlers
  const handleCategoryChange = (categoryId) => {
    updateFilters({ category: categoryId })
  }

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm })
  }

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters)
  }

  const handleClearFilters = () => {
    clearFilters()
  }

  // Transaction handlers
  const handleQuickTopUp = async (game) => {
    console.log('Quick top up for:', game.name)
    // Navigate to checkout with pre-selected game
    // This would typically use React Router navigation
  }

  const createTransaction = async (transactionData) => {
    try {
      const { data, error } = await supabaseHelpers.createTransaction({
        ...transactionData,
        user_id: user?.id
      })
      
      if (error) {
        throw error
      }

      // Refresh user transactions
      await loadUserData()
      
      return { data, error: null }
    } catch (error) {
      console.error('Error creating transaction:', error)
      return { data: null, error }
    }
  }

  // Favorites handlers
  const addToFavorites = async (gameId) => {
    try {
      const { error } = await supabaseHelpers.addToFavorites(gameId)
      if (error) throw error
      await loadUserData()
      return { error: null }
    } catch (error) {
      console.error('Error adding to favorites:', error)
      return { error }
    }
  }

  const removeFromFavorites = async (gameId) => {
    try {
      const { error } = await supabaseHelpers.removeFromFavorites(gameId)
      if (error) throw error
      await loadUserData()
      return { error: null }
    } catch (error) {
      console.error('Error removing from favorites:', error)
      return { error }
    }
  }

  const isGameFavorited = (gameId) => {
    return userFavorites.some(fav => fav.game_id === gameId)
  }

  // Review handlers
  const createReview = async (gameId, rating, comment) => {
    try {
      const { data, error } = await supabaseHelpers.createReview({
        user_id: user?.id,
        game_id: gameId,
        rating,
        comment
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error creating review:', error)
      return { data: null, error }
    }
  }

  // Get categories with proper structure (with null checks)
  const categories = React.useMemo(() => {
    try {
      if (getCategories && typeof getCategories === 'function') {
        return getCategories().map(cat => ({
          id: cat.id,
          name: cat.name,
          icon: getCategoryIcon(cat.id),
          count: cat.count
        }))
      }
      return []
    } catch (error) {
      console.error('Error getting categories:', error)
      return []
    }
  }, [getCategories])

  return {
    // Data for components (transformed to match existing structure)
    categories,
    trendingGames,
    recommendedGames,
    allGames: allGames,
    filteredGames: allGames,
    promoOffers,
    searchSuggestions,
    userPreferences: userPreferencesFormatted,
    paymentMethods,
    systemSettings,
    
    // User data
    user,
    profile,
    userFavorites,
    userTransactions,
    isAuthenticated: !!user,
    
    // Filter state
    filters,
    selectedCategory: filters.category,
    searchTerm: filters.search,
    
    // Loading states
    isLoading: !initialLoadComplete && (gameLoading || authLoading),
    
    // Handlers (compatible with existing components)
    handleCategoryChange,
    handleSearch,
    handleFiltersChange,
    handleClearFilters,
    handleQuickTopUp,
    
    // New Supabase-specific handlers
    createTransaction,
    addToFavorites,
    removeFromFavorites,
    isGameFavorited,
    createReview,
    loadUserData,
    
    // Helper functions
    refreshData: loadUserData
  }
}

export default useSupabaseData