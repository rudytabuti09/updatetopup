import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseHelpers } from '../utils/supabase'

const GameContext = createContext({})

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}

export const GameProvider = ({ children }) => {
  const [games, setGames] = useState([])
  const [promotions, setPromotions] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [systemSettings, setSystemSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters and search state
  const [filters, setFilters] = useState({
    category: 'all',
    search: '',
    sortBy: 'popular',
    priceRange: null,
    processingSpeed: [],
    hasPromo: false
  })

  const [filteredGames, setFilteredGames] = useState([])

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    filterGames()
  }, [games, filters])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all initial data in parallel
      const [
        gamesResult,
        promotionsResult,
        paymentMethodsResult,
        settingsResult
      ] = await Promise.all([
        supabaseHelpers.getGames(),
        supabaseHelpers.getActivePromotions(),
        supabaseHelpers.getPaymentMethods(),
        supabaseHelpers.getPublicSettings()
      ])

      if (gamesResult.error) {
        throw gamesResult.error
      }
      if (promotionsResult.error) {
        throw promotionsResult.error
      }
      if (paymentMethodsResult.error) {
        throw paymentMethodsResult.error
      }
      if (settingsResult.error) {
        throw settingsResult.error
      }

      setGames(gamesResult.data || [])
      setPromotions(promotionsResult.data || [])
      setPaymentMethods(paymentMethodsResult.data || [])
      setSystemSettings(settingsResult.data || {})

    } catch (err) {
      console.error('Error loading initial data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterGames = () => {
    let filtered = [...games]

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(game => 
        game.category === filters.category
      )
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm) ||
        game.description?.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
      )
    }

    // Price range filter
    if (filters.priceRange) {
      const priceRanges = {
        'under-50k': { min: 0, max: 50000 },
        '50k-100k': { min: 50000, max: 100000 },
        '100k-250k': { min: 100000, max: 250000 },
        '250k-500k': { min: 250000, max: 500000 },
        'above-500k': { min: 500000, max: Infinity }
      }
      
      const range = priceRanges[filters.priceRange]
      if (range) {
        filtered = filtered.filter(game => {
          const minPrice = game.min_price || 0
          return minPrice >= range.min && minPrice <= range.max
        })
      }
    }

    // Processing speed filter
    if (filters.processingSpeed.length > 0) {
      filtered = filtered.filter(game =>
        filters.processingSpeed.includes(game.processing_speed)
      )
    }

    // Promo filter
    if (filters.hasPromo) {
      const gameIdsWithPromo = promotions.map(promo => promo.game_id)
      filtered = filtered.filter(game => gameIdsWithPromo.includes(game.id))
    }

    // Sort
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'price-low':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.max_price || 0) - (a.max_price || 0))
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      default: // popular
        filtered.sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
    }

    setFilteredGames(filtered)
  }

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const clearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      sortBy: 'popular',
      priceRange: null,
      processingSpeed: [],
      hasPromo: false
    })
  }

  const getGameBySlug = async (slug) => {
    try {
      const { data, error } = await supabaseHelpers.getGameBySlug(slug)
      if (error) {
        throw error
      }
      return { data, error: null }
    } catch (err) {
      console.error('Error getting game by slug:', err)
      return { data: null, error: err }
    }
  }

  const getGamePackages = async (gameId) => {
    try {
      const { data, error } = await supabaseHelpers.getGamePackages(gameId)
      if (error) {
        throw error
      }
      return { data, error: null }
    } catch (err) {
      console.error('Error getting game packages:', err)
      return { data: null, error: err }
    }
  }

  const refreshGames = async () => {
    try {
      const { data, error } = await supabaseHelpers.getGames()
      if (error) {
        throw error
      }
      setGames(data || [])
      return { data, error: null }
    } catch (err) {
      console.error('Error refreshing games:', err)
      return { data: null, error: err }
    }
  }

  const refreshPromotions = async () => {
    try {
      const { data, error } = await supabaseHelpers.getActivePromotions()
      if (error) {
        throw error
      }
      setPromotions(data || [])
      return { data, error: null }
    } catch (err) {
      console.error('Error refreshing promotions:', err)
      return { data: null, error: err }
    }
  }

  // Get categories with counts
  const getCategories = () => {
    const categoryCounts = games.reduce((acc, game) => {
      acc[game.category] = (acc[game.category] || 0) + 1
      return acc
    }, {})

    const categoryNames = {
      'moba': 'MOBA',
      'battle-royale': 'Battle Royale',
      'rpg': 'RPG',
      'strategy': 'Strategy',
      'racing': 'Racing',
      'sports': 'Sports',
      'casual': 'Casual',
      'fps': 'FPS',
      'mmorpg': 'MMORPG'
    }

    const categories = [
      { id: 'all', name: 'Semua Game', count: games.length }
    ]

    Object.entries(categoryCounts).forEach(([key, count]) => {
      categories.push({
        id: key,
        name: categoryNames[key] || key,
        count
      })
    })

    return categories
  }

  // Get trending games (popular games)
  const getTrendingGames = () => {
    return games
      .filter(game => game.is_popular)
      .sort((a, b) => (b.review_count || 0) - (a.review_count || 0))
      .slice(0, 8)
  }

  // Get recommended games based on user preferences
  const getRecommendedGames = (userPreferences = {}) => {
    let recommended = games.filter(game => !game.is_popular)

    // Filter by favorite genres if available
    if (userPreferences.favorite_genres?.length > 0) {
      recommended = recommended.filter(game => 
        userPreferences.favorite_genres.includes(game.category)
      )
    }

    // Sort by rating and review count
    recommended.sort((a, b) => {
      const scoreA = (a.rating || 0) * Math.log(a.review_count || 1)
      const scoreB = (b.rating || 0) * Math.log(b.review_count || 1)
      return scoreB - scoreA
    })

    return recommended.slice(0, 6)
  }

  const value = {
    // Data
    games,
    filteredGames,
    promotions,
    paymentMethods,
    systemSettings,
    loading,
    error,

    // Filters
    filters,
    updateFilters,
    clearFilters,

    // Actions
    loadInitialData,
    refreshGames,
    refreshPromotions,
    getGameBySlug,
    getGamePackages,

    // Computed values
    getCategories,
    getTrendingGames,
    getRecommendedGames,

    // Stats
    totalGames: games.length,
    totalActivePromotions: promotions.length
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}