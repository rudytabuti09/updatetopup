'use client'

import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider 
      // Refetch session every 5 minutes
      refetchInterval={5 * 60}
      // Refetch session on window focus
      refetchOnWindowFocus={true}
      // Base path for NextAuth
      basePath="/api/auth"
    >
      {children}
    </SessionProvider>
  )
}
