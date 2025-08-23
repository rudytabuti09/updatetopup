'use client'

import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'

interface SessionDebugProps {
  show?: boolean
}

export function SessionDebug({ show = false }: SessionDebugProps) {
  const { data: session, status } = useSession()
  const [isVisible, setIsVisible] = useState(show)
  
  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
        >
          🐛 Debug Session
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <GlassCard className="p-4 bg-black/90">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-semibold">Session Debug</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white/60 hover:text-white p-1 h-auto"
          >
            ✕
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/60">Status:</span>
            <span className={`font-mono ${
              status === 'loading' ? 'text-yellow-400' :
              status === 'authenticated' ? 'text-green-400' :
              'text-red-400'
            }`}>
              {status}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-white/60">User:</span>
            <span className="text-white font-mono text-xs">
              {session?.user ? '✓' : '✗'}
            </span>
          </div>
          
          {session?.user && (
            <>
              <div className="pt-2 border-t border-white/10">
                <div className="text-white/60 text-xs mb-1">User Data:</div>
                <div className="text-white/80 text-xs">
                  <div>ID: {session.user.id || 'N/A'}</div>
                  <div>Email: {session.user.email || 'N/A'}</div>
                  <div>Name: {session.user.name || 'N/A'}</div>
                  <div>Role: {session.user.role || 'N/A'}</div>
                </div>
              </div>
            </>
          )}
          
          <div className="pt-2 border-t border-white/10">
            <div className="text-white/60 text-xs mb-1">Environment:</div>
            <div className="text-white/80 text-xs">
              <div>NODE_ENV: {process.env.NODE_ENV}</div>
              <div>NextAuth URL: {process.env.NEXTAUTH_URL ? '✓' : '✗'}</div>
              <div>NextAuth Secret: {process.env.NEXTAUTH_SECRET ? '✓' : '✗'}</div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/10">
            <div className="text-white/60 text-xs mb-1">Client Info:</div>
            <div className="text-white/80 text-xs">
              <div>Hydrated: {typeof window !== 'undefined' ? '✓' : '✗'}</div>
              <div>Timestamp: {new Date().toISOString().split('T')[1].split('.')[0]}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-t border-white/10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('=== SESSION DEBUG INFO ===')
              console.log('Status:', status)
              console.log('Session:', session)
              console.log('Environment:', {
                NODE_ENV: process.env.NODE_ENV,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL,
                NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET
              })
              console.log('Client:', {
                userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
                hydrated: typeof window !== 'undefined'
              })
            }}
            className="w-full text-xs text-blue-400 border-blue-400/20 hover:bg-blue-400/10"
          >
            📋 Log to Console
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
