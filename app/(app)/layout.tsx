import { Sidebar } from '@/components/shared/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <main className="ml-60 min-h-screen p-6">
        {children}
      </main>
    </div>
  )
}
