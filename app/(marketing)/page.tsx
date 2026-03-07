'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/shared/Navbar'
import { Loader } from '@/components/shared/Loader'
import { Hero } from '@/components/marketing/Hero'
import { ComparisonTable } from '@/components/marketing/ComparisonTable'
import { PricingCards } from '@/components/marketing/PricingCards'
import { Testimonials } from '@/components/marketing/Testimonials'
import { FadeIn } from '@/components/shared/FadeIn'
import Link from 'next/link'
import { ArrowRight, Plus, Minus } from 'lucide-react'

const howItWorksSteps = [
  { num: '01', title: 'Paste your broken code', description: 'Code and error message go in. No project setup, no repo linking.' },
  { num: '02', title: 'Answer three questions', description: 'DebugMate asks what it needs to narrow down the root cause. Not generic. Specific to your code.' },
  { num: '03', title: 'Read the report', description: 'Root cause, fix steps, corrected code, and one concept to study so this class of bug stops recurring.' },
]

const faqs = [
  { q: 'How is this different from pasting my error into ChatGPT?', a: 'ChatGPT gives you a fix. DebugMate asks you three questions first, then gives you a structured report that explains the root cause, not just the patch. It also tracks what types of bugs you keep hitting so you can actually stop making them.' },
  { q: 'What languages are supported?', a: 'JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, Swift, Kotlin, C#, HTML, CSS, and SQL. If yours isn\'t listed, it\'ll probably still work — the analysis is language-aware but not language-locked.' },
  { q: 'Is my code stored somewhere?', a: 'Your code is sent to AI for analysis and stored in your session history. We don\'t share it with anyone. You can delete any session whenever you want. We don\'t train on your code.' },
  { q: 'What happens at the free limit?', a: 'You get a heads-up at 8/10 sessions. After 10, you wait for next month\'s reset or upgrade to Pro. No bait-and-switch. The free tier is real.' },
  { q: 'Can I use this for a bootcamp or classroom?', a: 'Yes. The Bootcamp plan gives you 50 seats, an instructor dashboard, and student-level analytics. Email us for custom pricing if you need more seats.' },
]

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      {faqs.map((faq, i) => (
        <div key={faq.q} className="border-b border-[var(--border)]">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left transition-colors duration-150"
          >
            <span className={`text-[14px] font-medium ${openIdx === i ? 'text-[var(--text)]' : 'text-[var(--muted)]'}`}>
              {faq.q}
            </span>
            {openIdx === i ? (
              <Minus className="w-4 h-4 text-[var(--muted-2)] flex-shrink-0 ml-4" />
            ) : (
              <Plus className="w-4 h-4 text-[var(--muted-2)] flex-shrink-0 ml-4" />
            )}
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openIdx === i ? '200px' : '0px',
              opacity: openIdx === i ? 1 : 0,
            }}
          >
            <p className="text-[13px] text-[var(--muted)] leading-relaxed pb-5">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [loaded, setLoaded] = useState(false)
  const handleLoaded = useCallback(() => setLoaded(true), [])

  return (
    <>
      {!loaded && <Loader onComplete={handleLoaded} />}
      <div className="min-h-screen" style={{ background: 'var(--bg)', opacity: loaded ? 1 : 0, transition: 'opacity 300ms ease' }}>
        <Navbar />
        <Hero />

        {/* How It Works */}
        <section id="how-it-works" className="py-[96px] px-6">
          <div className="max-w-4xl mx-auto">
            <FadeIn>
              <div className="mb-10">
                <h2 className="text-display text-3xl text-[var(--text)] mb-2">The debug flow</h2>
                <p className="text-[13px] text-[var(--muted)]">What happens when you paste your code in</p>
              </div>
            </FadeIn>

            {/* Steps with dashed connector and irregular grid */}
            <FadeIn>
              <div className="relative">
                {/* Dashed connector line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px" style={{ borderTop: '1px dashed var(--border-hover)', transform: 'translateY(-50%)' }} />

                <div className="grid md:grid-cols-3 gap-5" style={{ gridTemplateColumns: '1fr 1.1fr 0.95fr' }}>
                  {howItWorksSteps.map((step, i) => (
                    <motion.div
                      key={step.num}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ delay: i * 0.08, duration: 0.4, ease: [0, 0, 0.2, 1] }}
                      className="card-hover relative p-5"
                      style={{ overflow: 'hidden' }}
                    >
                      {/* Faint numeral behind */}
                      <span className="absolute top-2 right-3 text-[64px] font-bold text-[var(--text)] select-none pointer-events-none" style={{ opacity: 0.035, lineHeight: 1 }}>
                        {step.num}
                      </span>

                      <div className="relative z-10">
                        <span className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-wider mb-3 block">{step.num}</span>
                        <h3 className="font-bold text-[15px] text-[var(--text)] mb-1.5">{step.title}</h3>
                        <p className="text-[13px] text-[var(--muted)] leading-relaxed">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <FadeIn>
          <ComparisonTable />
        </FadeIn>

        <FadeIn>
          <Testimonials />
        </FadeIn>

        <FadeIn>
          <PricingCards />
        </FadeIn>

        {/* FAQ */}
        <section className="py-[64px] px-6">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="mb-8">
                <h2 className="text-display text-3xl text-[var(--text)] mb-2">Things people ask</h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.08}>
              <FAQ />
            </FadeIn>
          </div>
        </section>

        {/* Final CTA */}
        <FadeIn>
          <section className="py-[80px] px-6">
            <div className="max-w-lg mx-auto">
              <h2 className="text-display text-3xl text-[var(--text)] mb-3">If you&apos;re tired of fixing bugs you don&apos;t understand</h2>
              <p className="text-[13px] text-[var(--muted)] mb-6">Free. No card. Just paste your code.</p>
              <Link href="/sign-up">
                <button className="btn-primary">
                  Try it
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </section>
        </FadeIn>

        {/* Footer — left aligned, not centered */}
        <FadeIn>
          <footer className="border-t border-[var(--border)] py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between gap-8 mb-6">
              {/* Left: logo */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-[14px] text-[var(--text)]">DebugMate</span>
                <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)]" />
              </div>

              {/* Right: link columns */}
              <div className="flex gap-10">
                <div className="space-y-2">
                  <Link href="/pricing" className="block text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">Pricing</Link>
                  <Link href="/blog" className="block text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">Blog</Link>
                </div>
                <div className="space-y-2">
                  <a href="mailto:dev.priyanshu.singh@gmail.com" className="block text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">Contact</a>
                  <Link href="/sign-up" className="block text-[13px] text-[var(--muted)] hover:text-[var(--text)] transition-colors duration-150">Sign Up</Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between text-[11px] font-mono text-[var(--muted-2)]">
              <span>© 2026 DebugMate. All rights reserved.</span>
              <span>Built by Priyanshu</span>
            </div>
          </div>
          </footer>
        </FadeIn>
      </div>
    </>
  )
}
