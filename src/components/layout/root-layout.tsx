'use client'

import { Navbar } from "./navbar"
import { Footer } from "./footer"
import { BottomNavigation } from "./bottom-nav"

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
      <BottomNavigation />
    </div>
  )
}
