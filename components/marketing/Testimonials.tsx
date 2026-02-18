const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Junior Developer @ Razorpay',
    avatar: 'AS',
    quote:
      'DebugMate didn\'t just fix my async/await bug — it explained closures in a way that finally clicked. I\'ve stopped making the same mistake.',
    color: 'var(--accent-red)',
  },
  {
    name: 'Priya Nair',
    role: 'Bootcamp Student, Masai School',
    avatar: 'PN',
    quote:
      'The 3 clarifying questions are genius. It feels like a senior dev is actually reviewing my code, not just spitting out a fix.',
    color: 'var(--accent-blue)',
  },
  {
    name: 'Rahul Gupta',
    role: 'Solo Founder',
    avatar: 'RG',
    quote:
      'I used to spend 4 hours debugging. Now I spend 20 minutes and actually understand what went wrong. Worth every rupee.',
    color: 'var(--accent-green)',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[var(--surface)]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-display text-4xl text-[var(--text-primary)] mb-4">
            Developers Love DebugMate
          </h2>
          <p className="text-[var(--text-secondary)]">
            Join thousands of developers who debug smarter
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-6 flex flex-col">
              <p className="text-[var(--text-secondary)] leading-relaxed flex-1 mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display text-white flex-shrink-0"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-ui text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
