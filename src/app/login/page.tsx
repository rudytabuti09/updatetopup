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
    <div className="min-h-screen bg-gradient-to-br from-wmx-light to-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-neon-magenta" />
        <p className="text-wmx-gray-600">Redirecting to sign in page...</p>
      </div>
    </div>
  )
}
