import { Navbar } from '@/components/shared/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { PricingCards } from '@/components/marketing/PricingCards'
import { Testimonials } from '@/components/marketing/Testimonials'
import { FadeIn } from '@/components/shared/FadeIn'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const howItWorksSteps = [
  {
    step: 1,
    title: 'Paste your code + error',
    description: 'Drop in your broken code and error message. DebugMate reads it all.',
    color: 'var(--accent-red)',
  },
  {
    step: 2,
    title: 'Answer 3 smart questions',
    description: 'DebugMate asks targeted questions to understand your exact context.',
    color: 'var(--accent-blue)',
  },
  {
    step: 3,
    title: 'Get your debug report',
    description: 'Receive a full report: root cause, fix steps, and what to learn.',
    color: 'var(--accent-green)',
  },
]

const faqs = [
  {
    q: 'How is DebugMate different from ChatGPT?',
    a: 'ChatGPT gives you a fix. DebugMate asks clarifying questions first, then gives you a structured report that explains WHY the bug happened and what concept to learn. It also tracks your weak spots over time.',
  },
  {
    q: 'What languages are supported?',
    a: 'JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, Swift, Kotlin, C#, HTML, CSS, and SQL.',
  },
  {
    q: 'Is my code safe?',
    a: 'Your code is sent to Claude AI for analysis and stored securely in our database. We never share your code with other users. You can delete your sessions at any time.',
  },
  {
    q: 'What happens when I hit the free limit?',
    a: "You'll see a clear message when you're at 8/10 sessions. After 10, you'll need to upgrade to Pro or wait for your monthly reset.",
  },
  {
    q: 'Can I use DebugMate for my bootcamp students?',
    a: 'Yes! Our Bootcamp plan supports up to 50 seats with an instructor dashboard and student analytics. Contact us for custom pricing.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <Hero />

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-display text-4xl text-[var(--text-primary)] mb-4">
              How DebugMate Works
            </h2>
            <p className="text-[var(--text-secondary)]">Three steps to understanding your bug</p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.12} direction="up">
                <div className="card card-hover p-6 text-center h-full">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-display text-white mx-auto mb-4"
                    style={{ background: step.color }}
                  >
                    {step.step}
                  </div>
                  <h3 className="font-display text-lg text-[var(--text-primary)] mb-2">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{step.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <FadeIn direction="up">
        <ComparisonTable />
      </FadeIn>

      <FadeIn direction="up">
        <Testimonials />
      </FadeIn>

      <FadeIn direction="up">
        <PricingCards />
      </FadeIn>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-display text-4xl text-[var(--text-primary)] text-center mb-12">
              Frequently Asked Questions
            </h2>
          </FadeIn>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.08} direction="up">
                <div className="card card-hover p-6">
                  <h3 className="font-ui text-[var(--text-primary)] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FadeIn direction="up">
        <section className="py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-display text-5xl text-[var(--text-primary)] mb-4">
              Start debugging smarter today
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Free forever. No credit card required.
            </p>
            <Link href="/sign-up">
              <button className="btn-primary text-lg py-4 px-8">
                Start Free — 10 Sessions/Month
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </section>
      </FadeIn>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="DebugMate Logo" width={24} height={24} className="rounded-md" />
            <span className="font-display text-sm text-[var(--text-primary)]">DebugMate</span>
          </div>
          <div className="flex gap-6 text-xs text-[var(--text-muted)]">
            <Link href="/pricing" className="hover:text-[var(--text-secondary)] transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-[var(--text-secondary)] transition-colors">Blog</Link>
            <a href="mailto:dev.priyanshu.singh@gmail.com" className="hover:text-[var(--text-secondary)] transition-colors">Contact</a>
          </div>
          <p className="text-xs text-[var(--text-muted)]">© 2026 DebugMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
