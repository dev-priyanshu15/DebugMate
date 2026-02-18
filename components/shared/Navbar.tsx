'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { isSignedIn } = useUser()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="DebugMate Logo" width={36} height={36} className="rounded-lg" />
          <span className="text-display text-lg text-[var(--text-primary)]">DebugMate</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Pricing
          </Link>
          <Link href="/blog" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Blog
          </Link>
        </nav>

        {/* CTA buttons + theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>
          )}

          {isSignedIn ? (
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-sm"
              >
                Dashboard
              </motion.button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <button className="btn-secondary text-sm">Sign In</button>
              </Link>
              <Link href="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm"
                >
                  Start Free
                </motion.button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}
          <button
            className="text-[var(--text-secondary)]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 space-y-3"
        >
          <Link href="/pricing" className="block text-sm font-ui text-[var(--text-secondary)]" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link href="/blog" className="block text-sm font-ui text-[var(--text-secondary)]" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          {isSignedIn ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <button className="btn-primary text-sm w-full justify-center">Dashboard</button>
            </Link>
          ) : (
            <div className="flex gap-3">
              <Link href="/sign-in" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="btn-secondary text-sm w-full justify-center">Sign In</button>
              </Link>
              <Link href="/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary text-sm w-full justify-center">Start Free</button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  )
}
