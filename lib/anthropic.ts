import Groq from 'groq-sdk'
import { ClarifyingQuestion, DebugReport } from '@/types'

// Lazy client — only instantiated at runtime, not at build time
let _groq: Groq | null = null
function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })
  }
  return _groq
}

// Using llama-3.3-70b — fast, free, and very capable
const MODEL = 'llama-3.3-70b-versatile'

const CLARIFYING_QUESTIONS_SYSTEM = `You are DebugMate, a world-class debugging assistant with 20 years of software engineering experience. Your role is to ask exactly 3 short, targeted clarifying questions before diagnosing a bug — just like a senior developer would in a code review.

Rules:
- Ask exactly 3 questions, no more, no less
- Questions must be specific to the code and error provided
- Avoid generic questions like 'what have you tried?'
- Each question should help narrow down the root cause
- Keep each question under 15 words
- Return ONLY valid JSON, no markdown, no explanation

Return format:
{
  "questions": [
    {"id": "1", "question": "string"},
    {"id": "2", "question": "string"},
    {"id": "3", "question": "string"}
  ],
  "errorCategory": "string (e.g. async/await, null reference, type mismatch)",
  "language": "string"
}`

const DEBUG_REPORT_SYSTEM = `You are DebugMate. Based on the code, error, and the developer's answers to your clarifying questions, produce a complete debug report.

Rules:
- rootCause must be in plain English a junior developer can understand
- stepByStepFix must be actionable numbered steps
- Include actual corrected code snippets where relevant
- whatToLearn must point to a real, learnable concept
- similarBugs must be real patterns the dev should watch for
- Be encouraging but honest
- Return ONLY valid JSON, no markdown, no extra text

Return format:
{
  "rootCause": {
    "summary": "string (1 sentence)",
    "explanation": "string (2-3 sentences plain English)",
    "severity": "low | medium | high"
  },
  "stepByStepFix": [
    {
      "step": 1,
      "instruction": "string",
      "code": "string or null",
      "explanation": "string (why this step matters)"
    }
  ],
  "fixedCode": "string (complete corrected code)",
  "whatToLearn": {
    "concept": "string",
    "whyItMatters": "string",
    "searchQuery": "string (what to Google to learn more)",
    "estimatedLearningTime": "string (e.g. 30 minutes)"
  },
  "similarBugs": [
    {
      "pattern": "string",
      "example": "string",
      "howToAvoid": "string"
    }
  ],
  "encouragement": "string (1 personalized encouraging sentence)",
  "errorCategory": "string"
}`

function extractJSON(text: string): string {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  // Otherwise find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) return jsonMatch[0]
  throw new Error('No valid JSON found in response')
}

export async function generateClarifyingQuestions(
  language: string,
  errorMessage: string,
  code: string
): Promise<{ questions: ClarifyingQuestion[]; errorCategory: string }> {
  const userMessage = `Language: ${language}
Error: ${errorMessage}
Code:
${code}`

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      const response = await getGroq().chat.completions.create({
        model: MODEL,
        max_tokens: 500,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: CLARIFYING_QUESTIONS_SYSTEM },
          { role: 'user', content: userMessage },
        ],
      })

      const text = response.choices[0]?.message?.content || ''
      const jsonText = extractJSON(text)
      const parsed = JSON.parse(jsonText)

      return {
        questions: parsed.questions as ClarifyingQuestion[],
        errorCategory: parsed.errorCategory as string,
      }
    } catch (error) {
      lastError = error as Error
      console.error(`Groq attempt ${attempt + 1} failed:`, error)
    }
  }

  throw lastError || new Error('Failed to generate clarifying questions')
}

export async function generateDebugReport(
  language: string,
  errorMessage: string,
  code: string,
  answersFormatted: string
): Promise<DebugReport> {
  const userMessage = `Language: ${language}
Error: ${errorMessage}
Code:
${code}

My answers to your questions:
${answersFormatted}`

  let lastError: Error | null = null

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
      }

      const response = await getGroq().chat.completions.create({
        model: MODEL,
        max_tokens: 2000,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: DEBUG_REPORT_SYSTEM },
          { role: 'user', content: userMessage },
        ],
      })

      const text = response.choices[0]?.message?.content || ''
      const jsonText = extractJSON(text)
      const parsed = JSON.parse(jsonText)

      return parsed as DebugReport
    } catch (error) {
      lastError = error as Error
      console.error(`Groq attempt ${attempt + 1} failed:`, error)
    }
  }

  throw lastError || new Error('Failed to generate debug report')
}
