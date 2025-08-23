import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'USER' | 'ADMIN' | 'SUPER_ADMIN'
  }
}
