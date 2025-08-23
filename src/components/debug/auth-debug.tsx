'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthDebug() {
  const { data: session, status } = useSession()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-[100] bg-black/90 text-white border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Auth Debug (Dev Only)</CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Session exists:</strong> {session ? 'Yes' : 'No'}
        </div>
        {session && (
          <>
            <div>
              <strong>User ID:</strong> {session.user?.id || 'N/A'}
            </div>
            <div>
              <strong>Email:</strong> {session.user?.email || 'N/A'}
            </div>
            <div>
              <strong>Name:</strong> {session.user?.name || 'N/A'}
            </div>
            <div>
              <strong>Role:</strong> {session.user?.role || 'N/A'}
            </div>
          </>
        )}
        <div className="pt-2 border-t border-white/20 text-xs text-gray-400">
          Refresh page to test persistence
        </div>
      </CardContent>
    </Card>
  )
}
