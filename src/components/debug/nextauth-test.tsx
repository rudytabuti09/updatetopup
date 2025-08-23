'use client'

import { useState } from 'react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface ApiTestResult {
  endpoint: string
  status: 'testing' | 'success' | 'error'
  data?: unknown
  error?: string
  timestamp: string
}

export function NextAuthTest() {
  const [results, setResults] = useState<ApiTestResult[]>([])
  const [isVisible, setIsVisible] = useState(false)

  const addResult = (endpoint: string, status: 'success' | 'error', data?: unknown, error?: string) => {
    setResults(prev => [...prev, {
      endpoint,
      status,
      data,
      error,
      timestamp: new Date().toISOString().split('T')[1].split('.')[0]
    }])
  }

  const testEndpoint = async (endpoint: string, description: string) => {
    setResults(prev => [...prev, {
      endpoint: `${description}`,
      status: 'testing',
      timestamp: new Date().toISOString().split('T')[1].split('.')[0]
    }])

    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (response.ok) {
        addResult(description, 'success', data)
      } else {
        addResult(description, 'error', null, `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      addResult(description, 'error', null, error instanceof Error ? error.message : 'Unknown error')
    }
  }

  const runAllTests = async () => {
    setResults([])
    
    // Test basic API endpoints
    await testEndpoint('/api/auth/providers', 'Auth Providers')
    await testEndpoint('/api/auth/session', 'Current Session')
    await testEndpoint('/api/auth/csrf', 'CSRF Token')
    
    // Test environment variables (client-side check)
    const envCheck = {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'Not set',
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET
    }
    addResult('Environment Variables', 'success', envCheck)
  }

  const clearResults = () => {
    setResults([])
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
        >
          🔧 NextAuth Test
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <GlassCard className="p-4 bg-black/95">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">NextAuth API Test</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-1 h-auto"
          >
            ✕
          </Button>
        </div>
        
        <div className="flex gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={runAllTests}
            className="text-xs text-green-400 border-green-400/20 hover:bg-green-400/10"
          >
            🚀 Run Tests
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearResults}
            className="text-xs text-gray-400 border-gray-400/20 hover:bg-gray-400/10"
          >
            🧹 Clear
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {results.length === 0 ? (
            <div className="text-white/60 text-sm text-center py-4">
            Click &quot;Run Tests&quot; to test NextAuth endpoints
            </div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs border ${
                  result.status === 'testing'
                    ? 'border-yellow-400/20 bg-yellow-400/5'
                    : result.status === 'success'
                    ? 'border-green-400/20 bg-green-400/5'
                    : 'border-red-400/20 bg-red-400/5'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-mono ${
                    result.status === 'testing'
                      ? 'text-yellow-400'
                      : result.status === 'success'
                      ? 'text-green-400'
                      : 'text-red-400'
                  }`}>
                    {result.endpoint}
                  </span>
                  <span className="text-white/40 text-xs">
                    {result.timestamp}
                  </span>
                </div>
                
                {result.status === 'testing' && (
                  <div className="text-yellow-400 text-xs mt-1">
                    Testing...
                  </div>
                )}
                
                {result.status === 'success' && result.data != null && (
                  <div className="text-white/60 text-xs mt-1 max-h-16 overflow-auto">
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </div>
                )}
                
                {result.status === 'error' && result.error && (
                  <div className="text-red-400 text-xs mt-1">
                    {result.error}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  )
}
