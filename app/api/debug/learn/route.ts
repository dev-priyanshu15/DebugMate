import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { LearnContent } from '@/types'

// Lazy Groq import — reuse the same setup as anthropic.ts
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

function generateFallbackContent(concept: string, language: string): LearnContent {
  return {
    concept,
    lesson: [
      `${concept} is an important concept in ${language} that many developers struggle with.`,
      `Understanding this concept deeply helps you write more reliable code and debug faster when things go wrong.`,
      `The key insight is to understand not just WHAT happened, but WHY it happened — so the same class of bug doesn't keep coming back.`,
    ],
    codeExamples: [
      { label: 'Common mistake', code: `// This is where bugs often hide\n// Always check your assumptions about ${concept}` },
    ],
    keyTakeaways: [
      `Always validate your assumptions about ${concept}`,
      `Use your IDE\'s type checking to catch issues early`,
      `Write small test cases when you encounter unfamiliar behavior`,
    ],
    quiz: [
      {
        id: 1,
        question: `What is the main reason ${concept} causes bugs?`,
        options: ['Syntax error', 'Wrong assumptions about behavior', 'Missing imports', 'Network issues'],
        correctIndex: 1,
        explanation: 'Most bugs related to this concept come from incorrect assumptions about how the code behaves.',
      },
      {
        id: 2,
        question: 'What should you do when you encounter this type of bug?',
        options: ['Copy a fix from Stack Overflow', 'Understand why it broke first', 'Delete the code and rewrite', 'Ignore it and move on'],
        correctIndex: 1,
        explanation: 'Understanding the root cause prevents the same class of bug from recurring.',
      },
      {
        id: 3,
        question: 'How can you prevent this type of bug in the future?',
        options: ['Write more code', 'Add validation and checks', 'Use a different language', 'Avoid using this feature'],
        correctIndex: 1,
        explanation: 'Adding proper validation and defensive checks is the best prevention strategy.',
      },
      {
        id: 4,
        question: 'What is the best debugging approach?',
        options: ['Random changes until it works', 'Read the error message carefully and trace the logic', 'Ask someone else to fix it', 'Restart the computer'],
        correctIndex: 1,
        explanation: 'Careful reading of error messages and logical tracing reveals the root cause.',
      },
      {
        id: 5,
        question: 'After fixing a bug, what should you do?',
        options: ['Move on immediately', 'Study the concept so this class of bug stops recurring', 'Delete the git history', 'Refactor everything'],
        correctIndex: 1,
        explanation: 'Learning the underlying concept ensures you grow as a developer and avoid repeat mistakes.',
      },
    ],
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { concept, whyItMatters, language, bugContext } = body

    if (!concept) {
      return NextResponse.json({ error: 'Concept is required' }, { status: 400 })
    }

    const lang = language || 'JavaScript'

    try {
      const groq = getGroq()

      const prompt = `You are a programming teacher. Generate a focused mini-lesson and 5 quiz questions about the concept: "${concept}"

Context: The student just debugged a ${lang} bug related to this concept. ${whyItMatters || ''} ${bugContext || ''}

Return ONLY valid JSON in this exact format (no markdown, no explanation outside JSON):
{
  "concept": "${concept}",
  "lesson": [
    "paragraph 1 explaining the concept clearly",
    "paragraph 2 with deeper explanation",
    "paragraph 3 with practical tips"
  ],
  "codeExamples": [
    { "label": "Wrong way", "code": "// bad code example" },
    { "label": "Right way", "code": "// correct code example" }
  ],
  "keyTakeaways": [
    "takeaway 1",
    "takeaway 2",
    "takeaway 3"
  ],
  "quiz": [
    {
      "id": 1,
      "question": "question text",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "why this answer is correct"
    }
  ]
}

RULES:
- Write lesson paragraphs at a beginner-to-intermediate level
- Code examples must be in ${lang}
- Quiz must have exactly 5 questions
- Each question has exactly 4 options
- correctIndex is 0-3
- Questions should test understanding, not memorization
- Make questions progressively harder
- Explanations should teach, not just say "correct"`

      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      })

      const raw = completion.choices[0]?.message?.content?.trim() || ''

      // Extract JSON from response
      let jsonStr = raw
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      if (jsonMatch) jsonStr = jsonMatch[0]

      const parsed: LearnContent = JSON.parse(jsonStr)

      // Validate structure
      if (!parsed.lesson || !parsed.quiz || parsed.quiz.length < 5) {
        console.warn('[Learn API] Incomplete AI response, using fallback')
        return NextResponse.json(generateFallbackContent(concept, lang))
      }

      // Ensure quiz has exactly 5 questions
      parsed.quiz = parsed.quiz.slice(0, 5)

      return NextResponse.json(parsed)
    } catch (aiError) {
      console.error('[Learn API] AI failed, using fallback:', aiError)
      return NextResponse.json(generateFallbackContent(concept, lang))
    }
  } catch (error) {
    console.error('[Learn API] Request error:', error)
    return NextResponse.json({ error: 'Failed to generate learning content' }, { status: 500 })
  }
}
