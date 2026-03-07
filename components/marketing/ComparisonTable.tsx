import { Check, X } from 'lucide-react'

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
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-display text-3xl text-[var(--text-primary)] mb-3">
            Why DebugMate?
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            See how we compare to your current debugging tools
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface)]" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                  <th className="text-left p-3.5 text-[12px] font-medium text-[var(--text-muted)] w-1/3 uppercase tracking-wider">Feature</th>
                  {tools.map((tool) => (
                    <th
                      key={tool.name}
                      className={`p-3.5 text-[12px] font-medium text-center uppercase tracking-wider ${
                        tool.highlight
                          ? 'text-[var(--accent-red)] bg-[rgba(255,92,124,0.05)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {tool.highlight && (
                        <span className="block text-[10px] badge-red mb-1 mx-auto w-fit normal-case tracking-normal">Best</span>
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
                    className="border-b border-[var(--border)] last:border-0 transition-colors duration-150 hover:bg-[var(--surface-2)]"
                  >
                    <td className="p-3.5 text-[13px] text-[var(--text-secondary)]">{feature}</td>
                    {tools.map((tool) => (
                      <td
                        key={tool.name}
                        className={`p-3.5 text-center ${tool.highlight ? 'bg-[rgba(255,92,124,0.03)]' : ''}`}
                      >
                        {tool.values[i] ? (
                          <Check className="w-4 h-4 text-[var(--accent-green)] mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-[var(--text-muted)] opacity-40 mx-auto" />
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
