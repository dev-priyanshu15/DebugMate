import { Check, Minus } from 'lucide-react'

const features = [
  'Asks clarifying questions first',
  'Explains WHY the bug happened',
  'Step-by-step fix with code',
  'Tracks your weak spots',
  'Teaches you what to learn',
  'Available 24/7',
  'Understands your context',
  'Gets better over time',
]

const tools = [
  { name: 'DebugMate', highlight: true, values: [true, true, true, true, true, true, true, true] },
  { name: 'Stack Overflow', values: [false, false, false, false, false, true, false, false] },
  { name: 'ChatGPT', values: [false, false, true, false, false, true, false, false] },
  { name: 'Senior Dev', values: [true, true, true, false, true, false, true, false] },
]

export function ComparisonTable() {
  return (
    <section className="py-[72px] px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h2 className="text-display text-3xl text-[var(--text)] mb-2">You&apos;re already using something</h2>
          <p className="text-[13px] text-[var(--muted)]">Here&apos;s what each option actually gives you</p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto" style={{ minWidth: '600px' }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border)]" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--surface)' }}>
                  <th className="text-left p-3 text-[11px] font-bold text-[var(--muted-2)] uppercase tracking-wider w-1/3">Feature</th>
                  {tools.map((tool) => (
                    <th key={tool.name} className="p-3 text-[11px] font-bold text-center uppercase tracking-wider relative" style={{ color: tool.highlight ? 'var(--accent)' : 'var(--muted)' }}>
                      {tool.highlight && (
                        <span className="tag-bordered text-[9px] block w-fit mx-auto mb-1">BEST</span>
                      )}
                      {tool.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr
                    key={feature}
                    className="border-b border-[var(--border)] last:border-0"
                    style={{ background: i % 2 === 1 ? 'rgba(255,255,255,0.012)' : 'transparent' }}
                  >
                    <td className="p-3 text-[13px] text-[var(--muted)]">{feature}</td>
                    {tools.map((tool) => (
                      <td
                        key={tool.name}
                        className="p-3 text-center"
                        style={{
                          borderLeft: tool.highlight ? '2px solid var(--accent)' : undefined,
                          background: tool.highlight ? 'rgba(56, 189, 248, 0.03)' : undefined,
                        }}
                      >
                        {tool.values[i] ? (
                          <span className="text-[var(--green)] text-[13px]">✓</span>
                        ) : (
                          <span className="text-[var(--muted-3)] text-[13px]">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
