'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useTheme } from '@/context/ThemeContext'
import { Home, Send, Repeat, FileText, User, Bell } from 'lucide-react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { variant, colors } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const token = localStorage.getItem('surexend_access_token')
    if (!token) {
      router.push('/auth/login')
    }
  }, [router])

  // Service worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }
  }, [])

  const navItems = [
    { label: 'Home', icon: Home, href: '/app/dashboard' },
    { label: 'Send', icon: Send, href: '/app/send' },
    { label: 'Convert', icon: Repeat, href: '/app/convert' },
    { label: 'Receive', icon: FileText, href: '/app/receive' }, // Usually bills or receive, using receive here
    { label: 'Profile', icon: User, href: '/app/profile' },
  ]

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" toastOptions={{ style: { background: '#0F1629', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <div className="flex h-screen overflow-hidden bg-[var(--app-bg)]">
        {/* Desktop Sidebar */}
        <aside className={`hidden md:flex flex-col w-64 border-r border-[rgba(255,255,255,0.06)] bg-[#0F1629] p-4`}>
          <div className="flex items-center gap-3 mb-10 px-4 pt-4">
            <img
              src={variant === 'gold' ? '/logo-mark-gold.png' : '/logo-mark-plain.png'}
              alt="SureXend"
              className={`w-8 h-8 object-contain ${variant === 'gold' ? 'gold-logo-glow' : ''}`}
              style={{
                filter: variant === 'gold'
                  ? 'brightness(1.25) drop-shadow(0 0 12px rgba(252, 211, 77, 0.9)) drop-shadow(0 0 25px rgba(212, 160, 23, 0.7))'
                  : 'invert(1) sepia(0.5) saturate(6) hue-rotate(30deg) brightness(1.1) drop-shadow(0 0 8px rgba(181, 226, 61, 0.4))',
              }}
            />
            <span className="font-bold text-lg text-white tracking-wider">
              SURE<span style={{ color: colors.primary }}>X</span>END
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? `bg-[rgba(255,255,255,0.05)] text-[${colors.primary}]` 
                      : 'text-[#64748B] hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
                  }`}
                  style={isActive ? { color: colors.primary } : {}}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 mt-auto">
            <div className={`p-4 rounded-xl border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">User</p>
                  <p className="text-xs text-[#64748B]">View Profile</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-screen bg-[var(--app-bg)]">
          {/* Mobile/Desktop Header */}
          <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#0A0F1E] z-10">
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})` }}>
                <span className="font-bold text-[#0D0D0D]">S</span>
              </div>
            </div>
            <div className="hidden md:block">
              <h2 className="text-xl font-bold text-white capitalize">{pathname.split('/').pop()}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                <Bell className="w-5 h-5 text-[#94A3B8]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: colors.primary }}></span>
              </button>
            </div>
          </header>

          <div className="flex-1 pb-24 md:pb-8 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-[#0D1322] border-t border-white/5 px-2 py-2 safe-bottom z-50">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                    isActive ? 'text-white' : 'text-[#64748B]'
                  }`}
                  style={isActive ? { color: colors.primary } : {}}
                >
                  <motion.div
                    animate={isActive ? { y: -2 } : { y: 0 }}
                    className="relative"
                  >
                    <item.icon className="w-6 h-6 mb-1" />
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </motion.div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </QueryClientProvider>
  )
}
