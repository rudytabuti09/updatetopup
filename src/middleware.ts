import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated
        if (!token) return false

        // Check admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token.role === 'ADMIN' || token.role === 'SUPER_ADMIN'
        }

        // Check user dashboard routes
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
