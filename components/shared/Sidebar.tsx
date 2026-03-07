'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Bug,
  TrendingUp,
  Settings,
  Zap,
  Users,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useUserData } from '@/hooks/useUser'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/debug/new', label: 'New Debug Session', icon: Bug, primary: true },
  { href: '/weak-spots', label: 'Weak Spots', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { data: userData } = useUserData()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const plan = userData?.plan || 'free'
  const sessionsUsed = userData?.sessions_used || 0
  const sessionsLimit = userData?.sessions_limit || 10

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r border-[var(--border)] bg-[var(--surface)] z-40">
      {/* Logo + theme toggle */}
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-display text-[15px] text-[var(--text)]">DebugMate</span>
          <span
            className="inline-block w-[7px] h-[7px] rounded-full bg-[var(--accent)]"
            style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
          />
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-7 h-7 flex items-center justify-center text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-[14px] h-[14px]" /> : <Moon className="w-[14px] h-[14px]" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          if (item.primary) {
            return (
              <Link key={item.href} href={item.href}>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-[var(--accent)] text-white font-medium text-[13px] mb-2 cursor-pointer transition-all duration-200 hover:brightness-110">
                  <Icon className="w-4 h-4" />
                  {item.label}
                  <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
                </div>
              </Link>
            )
          }

          return (
            <Link key={item.href} href={item.href}>
              <div className={cn('sidebar-item', isActive && 'active')}>
                <Icon className="w-4 h-4" />
                {item.label}
              </div>
            </Link>
          )
        })}

        {plan === 'bootcamp' && (
          <Link href="/bootcamp">
            <div className={cn('sidebar-item', pathname.startsWith('/bootcamp') && 'active')}>
              <Users className="w-4 h-4" />
              Bootcamp
            </div>
          </Link>
        )}
      </nav>

      {/* Session usage for free users */}
      {plan === 'free' && (
        <div className="px-3 pb-3 pt-0">
          <div className="card p-3 space-y-2">
            <div className="flex justify-between text-[11px] text-[var(--muted)] font-medium">
              <span>Sessions used</span>
              <span>{sessionsUsed}/{sessionsLimit}</span>
            </div>
            <div className="w-full h-1 bg-[var(--surface-2)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full transition-all duration-300"
                style={{ width: `${Math.min((sessionsUsed / sessionsLimit) * 100, 100)}%` }}
              />
            </div>
            <Link href="/settings/billing">
              <button className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[11px] font-medium text-[var(--accent)] hover:border-[var(--accent)] transition-colors duration-200">
                <Zap className="w-3 h-3" />
                Upgrade to Pro
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* User section */}
      <div className="px-3 py-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <UserButton afterSignOutUrl="/" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--text)] truncate">
              {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </p>
          </div>
          <span className="tag-bordered text-[9px] flex-shrink-0">
            {plan.toUpperCase()}
          </span>
        </div>
      </div>
    </aside>
  )
}
