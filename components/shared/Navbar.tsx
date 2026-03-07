'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'

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

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      style={{
        height: '58px',
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-display text-[15px] text-[var(--text)]">DebugMate</span>
          <span
            className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--accent)]"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">
            Pricing
          </Link>
          <Link href="/blog" className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">
            Blog
          </Link>
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-7 h-7 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-[14px] h-[14px]" /> : <Moon className="w-[14px] h-[14px]" />}
            </button>
          )}

          {isSignedIn ? (
            <Link href="/dashboard">
              <button className="btn-primary text-[13px] py-[7px] px-[14px]">Dashboard</button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">
                Sign In
              </Link>
              <Link href="/sign-up">
                <button className="btn-primary text-[13px] py-[7px] px-[14px]">Start Free</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-7 h-7 flex items-center justify-center text-[var(--muted)]"
            >
              {theme === 'dark' ? <Sun className="w-[14px] h-[14px]" /> : <Moon className="w-[14px] h-[14px]" />}
            </button>
          )}
          <button className="text-[var(--muted)] p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.12 }}
          className="md:hidden border-t border-[var(--border)] px-6 py-4 space-y-3"
          style={{ background: 'rgba(8, 11, 20, 0.96)' }}
        >
          <Link href="/pricing" className="block text-[13px] text-[var(--muted)]" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link href="/blog" className="block text-[13px] text-[var(--muted)]" onClick={() => setMobileOpen(false)}>Blog</Link>
          {isSignedIn ? (
            <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
              <button className="btn-primary text-[13px] w-full justify-center mt-2">Dashboard</button>
            </Link>
          ) : (
            <div className="flex gap-2 pt-2">
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
    </motion.header>
  )
}
