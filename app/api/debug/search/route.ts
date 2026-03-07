import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import Groq from 'groq-sdk'

let _groq: Groq | null = null
function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) throw new Error('GROQ_API_KEY missing')
    _groq = new Groq({ apiKey })
  }
  return _groq
}

const MODEL = 'llama-3.3-70b-versatile'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { query, context } = await req.json()

    if (!query || query.trim().length < 3) {
      return NextResponse.json({ error: 'Query too short' }, { status: 400 })
    }

    const groq = getGroq()

    const prompt = `You are a programming tutor inside DebugMate, a debugging tool. The user just debugged a bug and is learning about it.

Context: ${context || 'General programming question'}

User's question: "${query}"

Answer rules:
- Be concise but thorough (2-4 paragraphs max)
- Include a code example if relevant (use markdown fenced code blocks)
- Use simple language, explain like they're a junior developer
- Don't say "Great question!" or similar filler
- Be direct and practical
- If you include code, make it a complete, runnable example`

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 1500,
    })

    const answer = completion.choices[0]?.message?.content?.trim() || 'Could not generate an answer. Try rephrasing your question.'

    return NextResponse.json({ answer })
  } catch (error) {
    console.error('[Search API] Error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
