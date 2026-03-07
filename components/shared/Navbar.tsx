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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--border)]'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="DebugMate Logo" width={28} height={28} className="rounded-md" />
          <span className="text-display text-base text-[var(--text-primary)]">DebugMate</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="nav-link text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Pricing
          </Link>
          <Link href="/blog" className="nav-link text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Blog
          </Link>
        </nav>

        {/* CTA buttons + theme toggle */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}

          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="btn-primary text-[13px]">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <button className="btn-secondary text-[13px]">Sign In</button>
              </Link>
              <Link href="/sign-up">
                <button className="btn-primary text-[13px]">Start Free</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile: theme toggle + menu button */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-secondary)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            className="text-[var(--text-secondary)] p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-6 py-3 space-y-2"
        >
          <Link href="/pricing" className="block text-[13px] font-medium text-[var(--text-secondary)] py-1" onClick={() => setMobileOpen(false)}>
            Pricing
          </Link>
          <Link href="/blog" className="block text-[13px] font-medium text-[var(--text-secondary)] py-1" onClick={() => setMobileOpen(false)}>
            Blog
          </Link>
          {isSignedIn ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <button className="btn-primary text-[13px] w-full justify-center mt-1">Dashboard</button>
            </Link>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link href="/sign-in" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="btn-secondary text-[13px] w-full justify-center">Sign In</button>
              </Link>
              <Link href="/sign-up" className="flex-1" onClick={() => setMobileOpen(false)}>
                <button className="btn-primary text-[13px] w-full justify-center">Start Free</button>
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  )
}
