import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Welcome back</h1>
          <p className="text-[var(--text-secondary)] text-sm">Sign in to continue debugging smarter</p>
        </div>
        <SignIn />
      </div>
    </div>
  )
}
