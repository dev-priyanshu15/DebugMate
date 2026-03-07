const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Junior Developer @ Razorpay',
    avatar: 'AS',
    quote:
      'DebugMate didn\'t just fix my async/await bug — it explained closures in a way that finally clicked. I\'ve stopped making the same mistake.',
    color: 'var(--accent-red)',
    minH: '180px',
  },
  {
    name: 'Priya Nair',
    role: 'Bootcamp Student, Masai School',
    avatar: 'PN',
    quote:
      'The 3 clarifying questions are genius. It feels like a senior dev is actually reviewing my code, not just spitting out a fix.',
    color: 'var(--accent-blue)',
    minH: '200px',
  },
  {
    name: 'Rahul Gupta',
    role: 'Solo Founder',
    avatar: 'RG',
    quote:
      'I used to spend 4 hours debugging. Now I spend 20 minutes and actually understand what went wrong. Worth every rupee.',
    color: 'var(--accent-green)',
    minH: '170px',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 px-6 bg-[var(--surface)]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-display text-3xl text-[var(--text-primary)] mb-3">
            Developers Love DebugMate
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Join thousands of developers who debug smarter
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card p-5 flex flex-col transition-all duration-200 hover:border-[var(--border-hover)] hover:-translate-y-0.5"
              style={{ minHeight: t.minH }}
            >
              {/* Quote with left accent border */}
              <div className="flex-1 mb-5 pl-3.5 border-l-2" style={{ borderColor: t.color }}>
                <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
                  style={{
                    background: t.color,
                    boxShadow: `0 2px 8px ${t.color}30`,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
