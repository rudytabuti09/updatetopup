'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'

export function SessionStatus() {
  const { data: session, status } = useSession()
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="space-y-1">
        <div>Status: <span className={status === 'loading' ? 'text-yellow-400' : status === 'authenticated' ? 'text-green-400' : 'text-red-400'}>{status}</span></div>
        <div>User: {session?.user ? '✓' : '✗'}</div>
        <div>Environment: {process.env.NODE_ENV}</div>
        <div>NextAuth URL: {process.env.NEXTAUTH_URL ? '✓' : '✗'}</div>
        <div>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? '✓' : '✗'}</div>
        <div>Client Info:</div>
        <div>  Hydrated: {isClient ? '✓' : '✗'}</div>
        <div>  Timestamp: {new Date().toLocaleTimeString()}</div>
        {session && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>Email: {session.user?.email}</div>
            <div>Name: {session.user?.name || 'N/A'}</div>
            <div>Role: {session.user?.role || 'N/A'}</div>
          </div>
        )}
        <button 
          onClick={() => console.log('Session Debug:', { session, status, isClient })}
          className="mt-2 px-2 py-1 bg-blue-600 rounded text-white hover:bg-blue-700"
        >
          📋 Log to Console
        </button>
        
        {/* NextAuth API Test */}
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/api/auth/session')
              const data = await response.json()
              console.log('NextAuth API Response:', data)
            } catch (error) {
              console.error('NextAuth API Error:', error)
            }
          }}
          className="mt-1 px-2 py-1 bg-green-600 rounded text-white hover:bg-green-700 w-full"
        >
          NextAuth API Test
        </button>

        {/* Environment Test */}
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/api/debug/auth')
              const data = await response.json()
              console.log('Environment Check:', data)
              alert(JSON.stringify(data, null, 2))
            } catch (error) {
              console.error('Environment Check Error:', error)
            }
          }}
          className="mt-1 px-2 py-1 bg-purple-600 rounded text-white hover:bg-purple-700 w-full text-xs"
        >
          🚀 Run Tests
        </button>

        <button 
          onClick={() => {
            localStorage.clear()
            sessionStorage.clear()
            window.location.reload()
          }}
          className="mt-1 px-2 py-1 bg-red-600 rounded text-white hover:bg-red-700 w-full text-xs"
        >
          🧹 Clear
        </button>

        {/* Auth Providers Test */}
        <div className="mt-2 pt-2 border-t border-gray-600 text-xs">
          <div>Auth Providers</div>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('/api/auth/providers')
                const providers = await response.json()
                console.log('Auth Providers:', providers)
              } catch (error) {
                console.error('Providers Error:', error)
              }
            }}
            className="mt-1 px-1 py-0.5 bg-gray-600 rounded text-white hover:bg-gray-500 text-xs"
          >
            {new Date().toLocaleTimeString().slice(-8)}
          </button>
          <div className="text-xs opacity-75">Testing...</div>
        </div>
      </div>
    </div>
  )
}
