'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct signin page
    router.replace('/auth/signin')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-neon-magenta" />
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  )
}
