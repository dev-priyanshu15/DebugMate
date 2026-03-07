import Groq from 'groq-sdk'
import { ClarifyingQuestion, DebugReport } from '@/types'

// Lazy client — only instantiated at runtime, not at build time
let _groq: Groq | null = null
function getGroq(): Groq {
  if (!_groq) {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('[DebugMate AI] GROQ_API_KEY is missing from environment variables')
      throw new Error('AI service not configured')
    }
    _groq = new Groq({ apiKey })
  }
  return _groq
}

// Using llama-3.3-70b — fast, free, and very capable
const MODEL = 'llama-3.3-70b-versatile'
const MAX_RETRIES = 3
const RETRY_BASE_DELAY = 1500 // ms

// ── Structured Logging ──────────────────────────────────────

function logAI(level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    service: 'debugmate-ai',
    level,
    message,
    ...meta,
  }
  if (level === 'error') console.error(JSON.stringify(entry))
  else if (level === 'warn') console.warn(JSON.stringify(entry))
  else console.log(JSON.stringify(entry))
}

// ── Retry with exponential backoff ──────────────────────────

async function withRetry<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  opts: { label: string; timeoutMs?: number; maxRetries?: number }
): Promise<T> {
  const { label, timeoutMs = 25000, maxRetries = MAX_RETRIES } = opts
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      logAI('info', `${label}: attempt ${attempt}/${maxRetries}`)
      const result = await fn(controller.signal)
      clearTimeout(timer)
      logAI('info', `${label}: success on attempt ${attempt}`)
      return result
    } catch (error) {
      clearTimeout(timer)
      lastError = error as Error
      const isTimeout = (error as Error).name === 'AbortError'
      const isRateLimit = (error as Error).message?.includes('rate_limit') || (error as Error).message?.includes('429')

      logAI('warn', `${label}: attempt ${attempt} failed`, {
        attempt,
        error: (error as Error).message,
        isTimeout,
        isRateLimit,
      })

      if (attempt < maxRetries) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt - 1) + Math.random() * 500
        logAI('info', `${label}: retrying in ${Math.round(delay)}ms`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error(`${label} failed after ${maxRetries} attempts`)
}

// ── Prompts ─────────────────────────────────────────────────

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
- IMPORTANT: All code values ("code" in stepByStepFix, and "fixedCode") MUST use actual \\n newline characters for line breaks — one statement per line, properly indented with spaces. Never write multiple statements on a single line separated by semicolons.
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

// ── JSON extraction ─────────────────────────────────────────

function extractJSON(text: string): string {
  // Strip markdown code fences if present
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  // Otherwise find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) return jsonMatch[0]
  throw new Error('No valid JSON found in response')
}

// ── Fallback generators ─────────────────────────────────────

function generateFallbackQuestions(
  language: string,
  errorMessage: string
): { questions: ClarifyingQuestion[]; errorCategory: string } {
  const lowerError = errorMessage.toLowerCase()

  let errorCategory = 'runtime error'
  if (lowerError.includes('null') || lowerError.includes('undefined')) errorCategory = 'null reference'
  else if (lowerError.includes('type') || lowerError.includes('cannot')) errorCategory = 'type error'
  else if (lowerError.includes('async') || lowerError.includes('promise')) errorCategory = 'async/await'
  else if (lowerError.includes('import') || lowerError.includes('module')) errorCategory = 'module/import'
  else if (lowerError.includes('syntax')) errorCategory = 'syntax error'
  else if (lowerError.includes('network') || lowerError.includes('fetch')) errorCategory = 'network error'

  return {
    questions: [
      { id: '1', question: `Is the ${errorCategory} happening at runtime or compile time?` },
      { id: '2', question: `Have you verified your input data is valid before this code runs?` },
      { id: '3', question: `Is this code running in production or development environment?` },
    ],
    errorCategory,
  }
}

function generateFallbackReport(
  language: string,
  errorMessage: string,
  code: string,
  answersFormatted: string
): DebugReport {
  const lowerError = errorMessage.toLowerCase()

  let summary = 'A runtime error is occurring in your code.'
  let explanation = 'Based on the error message, your code is encountering an unexpected condition at runtime. This typically happens when the code assumptions don\'t match the actual data.'
  let severity: 'low' | 'medium' | 'high' = 'medium'
  let concept = 'Defensive programming'
  let whyItMatters = 'Adding proper checks prevents unexpected crashes'
  let searchQuery = `${language} ${errorMessage.split(':')[0]} fix`

  if (lowerError.includes('null') || lowerError.includes('undefined')) {
    summary = 'A value is null or undefined when your code expected it to exist.'
    explanation = 'Your code is trying to access a property or call a method on a value that is null or undefined. This usually means a database query returned no results, an API response was empty, or a variable was never assigned.'
    concept = 'Null safety and defensive checks'
    whyItMatters = 'Always checking for null/undefined before accessing properties prevents the most common class of runtime errors.'
    searchQuery = `${language} null check best practices`
  } else if (lowerError.includes('type')) {
    summary = 'A type mismatch is causing the error.'
    explanation = 'The code expected one type of value but received another. This could be a string where a number was expected, or an object where an array was expected.'
    concept = 'Type checking and validation'
    whyItMatters = 'Understanding types helps you write more predictable code.'
    searchQuery = `${language} type checking`
  } else if (lowerError.includes('async') || lowerError.includes('promise')) {
    summary = 'An async operation is not being handled correctly.'
    explanation = 'The error is related to asynchronous code. This often happens when a Promise is not awaited, a callback is missing, or an async function throws an unhandled error.'
    severity = 'high'
    concept = 'Async/await and Promise handling'
    whyItMatters = 'Most modern code is asynchronous. Understanding how Promises work is essential.'
    searchQuery = `${language} async await error handling`
  }

  return {
    rootCause: {
      summary,
      explanation,
      severity,
    },
    stepByStepFix: [
      {
        step: 1,
        instruction: 'Identify the exact line where the error occurs by reading the stack trace.',
        code: null,
        explanation: 'The stack trace tells you exactly where the error happened and the chain of function calls that led to it.',
      },
      {
        step: 2,
        instruction: 'Add a defensive check before the failing line to handle the edge case.',
        code: `// Add a check before accessing the value\nif (value === null || value === undefined) {\n  // Handle the missing value\n  console.error('Expected value was missing')\n  return // or throw a descriptive error\n}`,
        explanation: 'Defensive checks prevent the error from crashing your application.',
      },
      {
        step: 3,
        instruction: 'Test with the same input that caused the original error to verify the fix.',
        code: null,
        explanation: 'Always verify your fix with the original failing input before considering it resolved.',
      },
    ],
    fixedCode: `// DebugMate couldn't fully analyze this code with AI.\n// Here's the general approach to fix the error:\n//\n// 1. Add null/undefined checks\n// 2. Validate inputs before processing\n// 3. Add try/catch around risky operations\n\n${code}`,
    whatToLearn: {
      concept,
      whyItMatters,
      searchQuery,
      estimatedLearningTime: '30 minutes',
    },
    similarBugs: [
      {
        pattern: 'Missing null check',
        example: 'Accessing .property on a value that could be null',
        howToAvoid: 'Always check if a value exists before accessing its properties.',
      },
      {
        pattern: 'Unhandled async error',
        example: 'Not wrapping async calls in try/catch',
        howToAvoid: 'Use try/catch around all async operations and handle errors gracefully.',
      },
    ],
    encouragement: 'Every bug you fix makes you a better developer. The fact that you\'re debugging systematically already puts you ahead. Keep going! 🚀',
    errorCategory: summary.split(' ')[1] || 'runtime',
  }
}

// ── Public API ───────────────────────────────────────────────

export async function generateClarifyingQuestions(
  language: string,
  errorMessage: string,
  code: string
): Promise<{ questions: ClarifyingQuestion[]; errorCategory: string }> {
  const userMessage = `Language: ${language}
Error: ${errorMessage}
Code:
${code}`

  try {
    return await withRetry(
      async () => {
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
        if (!text) throw new Error('Empty response from AI')

        const jsonText = extractJSON(text)
        const parsed = JSON.parse(jsonText)

        if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
          throw new Error('Invalid questions format in response')
        }

        return {
          questions: parsed.questions as ClarifyingQuestion[],
          errorCategory: parsed.errorCategory as string,
        }
      },
      { label: 'generateClarifyingQuestions', timeoutMs: 20000 }
    )
  } catch (error) {
    logAI('error', 'All AI attempts failed for clarifying questions, using fallback', {
      language,
      errorMessageLength: errorMessage.length,
      codeLength: code.length,
      error: (error as Error).message,
    })
    // Return fallback questions so the user isn't blocked
    return generateFallbackQuestions(language, errorMessage)
  }
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

  try {
    return await withRetry(
      async () => {
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
        if (!text) throw new Error('Empty response from AI')

        const jsonText = extractJSON(text)
        const parsed = JSON.parse(jsonText)

        if (!parsed.rootCause || !parsed.stepByStepFix) {
          throw new Error('Invalid report format in response')
        }

        return parsed as DebugReport
      },
      { label: 'generateDebugReport', timeoutMs: 30000 }
    )
  } catch (error) {
    logAI('error', 'All AI attempts failed for debug report, using fallback', {
      language,
      errorMessageLength: errorMessage.length,
      codeLength: code.length,
      error: (error as Error).message,
    })
    // Return fallback report so the user always gets something useful
    return generateFallbackReport(language, errorMessage, code, answersFormatted)
  }
}
