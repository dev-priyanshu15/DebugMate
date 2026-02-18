'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Settings, User, Bell, Trash2 } from 'lucide-react'
import type { Metadata } from 'next'

export default function SettingsPage() {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Settings</h1>
        <p className="text-[var(--text-secondary)] text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-[var(--accent-blue)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Profile</h2>
        </div>

        <div className="flex items-center gap-4">
          {user?.imageUrl && (
            <img src={user.imageUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-[var(--border)]" />
          )}
          <div>
            <p className="font-ui text-[var(--text-primary)]">{user?.fullName || 'Developer'}</p>
            <p className="text-sm text-[var(--text-muted)]">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-ui text-[var(--text-secondary)] mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={user?.fullName || ''}
              className="input-field"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-ui text-[var(--text-secondary)] mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={user?.primaryEmailAddress?.emailAddress || ''}
              className="input-field opacity-60 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">Email is managed by your auth provider</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary text-sm"
        >
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Preferences */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-[var(--accent-yellow)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Preferences</h2>
        </div>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-ui text-[var(--text-primary)]">Email notifications</p>
            <p className="text-xs text-[var(--text-muted)]">Receive session summaries and limit warnings</p>
          </div>
          <button className="w-10 h-6 bg-[var(--accent-green)] rounded-full relative transition-colors">
            <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border-[rgba(255,77,109,0.3)]">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-4 h-4 text-[var(--accent-red)]" />
          <h2 className="font-display text-lg text-[var(--text-primary)]">Danger Zone</h2>
        </div>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button className="btn-secondary text-sm text-[var(--accent-red)] border-[rgba(255,77,109,0.3)] hover:border-[var(--accent-red)]">
          Delete Account
        </button>
      </div>
    </div>
  )
}
