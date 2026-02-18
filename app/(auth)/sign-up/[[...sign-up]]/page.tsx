import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-display text-3xl text-[var(--text-primary)] mb-2">Start debugging smarter</h1>
          <p className="text-[var(--text-secondary)] text-sm">Free forever · 10 sessions/month · No credit card</p>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
