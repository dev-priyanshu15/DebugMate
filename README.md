# DebugMate

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Not Just The Fix. The Understanding.**

DebugMate is a full-stack AI-powered debugging assistant built with Next.js 14 (App Router). It helps developers understand **why** their code broke, not just how to fix it. Users paste buggy code and an error message, the AI asks three targeted clarifying questions, then generates a structured debug report with root cause analysis, step-by-step fixes, corrected code, learning resources, similar bug patterns, and encouragement.

---

## Features

- **AI-Powered Debug Reports** — Root cause analysis, step-by-step fixes, corrected code, and learning resources powered by LLaMA 3.3 70B via Groq
- **Clarifying Questions** — Three targeted AI-generated questions before generating the report, ensuring accurate and relevant output
- **Learn and Quiz Mode** — After debugging, users can take a short lesson and a five-question quiz on the underlying concept
- **Weak Spots Tracking** — Recurring error categories are tracked per user so they can see patterns over time
- **Session History** — All completed debug sessions are saved and viewable from a dashboard
- **Subscription Plans** — Free (10 sessions/month), Pro, and Bootcamp tiers via Razorpay
- **15 Supported Languages** — JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, Swift, Kotlin, C#, HTML, CSS, SQL
- **Resilient by Design** — AI fallbacks, Redis + in-memory session caching, and session recovery ensure users are never blocked

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript (strict mode) |
| Auth | Clerk v5 (`@clerk/nextjs ^5.7.5`) |
| Database | Supabase (PostgreSQL via `@supabase/supabase-js ^2.96`) |
| AI / LLM | Groq SDK (`groq-sdk ^0.37`) — `llama-3.3-70b-versatile` |
| Caching | Upstash Redis (`@upstash/redis ^1.36`) + in-memory fallback |
| Rate Limiting | Upstash Ratelimit (`@upstash/ratelimit ^2.0`) |
| Payments | Razorpay (`razorpay ^2.9`) |
| UI Components | Radix UI primitives, Tailwind CSS 3.4, Framer Motion 11 |
| Code Editor | Monaco Editor (`@monaco-editor/react ^4.7`) |
| Charts | Recharts (`recharts ^2.15`) |
| State Management | Zustand 5 (persisted debug session state) |
| Data Fetching | TanStack React Query 5 |
| Validation | Zod 3.24 |
| Error Monitoring | Sentry (`@sentry/nextjs ^8.55`) |
| Analytics | PostHog (`posthog-js`) |
| Email | Resend (`resend ^4.8`) |
| Webhooks | Svix (Clerk webhook verification) |
| Styling | Tailwind CSS with CSS custom properties (dark/light theme via `next-themes`) |
| Fonts | Inter (UI) + JetBrains Mono (code) |
| Containerization | Docker (multi-stage Dockerfile + docker-compose) |

---

## Project Structure

```
debugmate/
├── app/
│   ├── layout.tsx                    # Root layout (ClerkProvider, ThemeProvider, QueryProvider)
│   ├── globals.css                   # CSS variables for dark/light theme
│   ├── (app)/                        # Authenticated app routes (with Sidebar)
│   │   ├── layout.tsx                # Sidebar + main content layout
│   │   ├── dashboard/                # Session history dashboard
│   │   ├── debug/
│   │   │   ├── new/page.tsx          # 3-step debug flow (Input -> Clarify -> Report)
│   │   │   └── [sessionId]/page.tsx  # View a saved debug session
│   │   └── weak-spots/page.tsx       # Weak spots tracking page with charts
│   ├── api/
│   │   ├── debug/
│   │   │   ├── start/route.ts        # POST — Submit code + error, get clarifying questions
│   │   │   ├── complete/route.ts     # POST — Submit answers, get debug report
│   │   │   ├── learn/route.ts        # POST — Generate learn content + quiz for a concept
│   │   │   └── search/route.ts       # POST — AI-powered search within debug context
│   │   ├── sessions/
│   │   │   ├── route.ts              # GET — List user's debug sessions (paginated)
│   │   │   └── [id]/route.ts         # GET/DELETE — Get or delete a specific session
│   │   ├── user/
│   │   │   ├── route.ts              # GET/PATCH — Get or update user profile
│   │   │   └── weak-spots/route.ts   # GET — Get user's weak spots
│   │   └── webhooks/
│   │       ├── clerk/route.ts        # Clerk user.created/updated/deleted webhooks
│   │       └── razorpay/route.ts     # Razorpay subscription webhooks
├── components/
│   ├── debug/                        # Debug flow UI components
│   ├── dashboard/                    # Dashboard-specific components
│   ├── marketing/                    # Landing page components
│   ├── shared/                       # Shared UI components (Navbar, Sidebar, etc.)
│   └── providers/                    # React context providers
├── hooks/
│   ├── useDebugSession.ts            # Zustand store for debug flow state (persisted)
│   ├── useUser.ts                    # React Query hook for user data
│   └── useWeakSpots.ts               # React Query hook for weak spots
├── lib/
│   ├── anthropic.ts                  # AI service (Groq/LLaMA) — questions + report generation
│   ├── redis.ts                      # Redis cache with in-memory fallback
│   ├── session-store.ts              # In-memory session store (Map with TTL)
│   ├── rate-limit.ts                 # Rate limiting (per-plan sliding window)
│   ├── get-or-create-user.ts         # Auto-create user in Supabase on first visit
│   ├── razorpay.ts                   # Razorpay client + subscription + webhook verification
│   ├── validations.ts                # Zod schemas + security pattern detection
│   ├── utils.ts                      # Utility functions (formatting, icons, sanitization)
│   └── supabase/
│       ├── server.ts                 # Server-side Supabase client (service role)
│       └── client.ts                 # Browser-side Supabase client (anon key)
├── types/
│   └── index.ts                      # All TypeScript interfaces and types
├── middleware.ts                      # Clerk auth middleware (public/protected routes)
├── Dockerfile                        # Multi-stage Docker build (deps -> build -> runner)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration with CSS variables
├── tsconfig.json                     # TypeScript config (strict, bundler resolution)
└── package.json                      # Dependencies and scripts
```

---

## How the Debug Flow Works

1. **Input** — The user selects a language (15 supported), pastes buggy code (10–10,000 characters), and types the error message.
2. **Clarify** — `POST /api/debug/start` sends the code and error to Groq (LLaMA 3.3 70B). The AI returns exactly three targeted clarifying questions and an error category. Session data is cached in Redis (30-minute TTL) with an in-memory fallback.
3. **Report** — `POST /api/debug/complete` takes the user's three answers, loads the cached session, and generates a full debug report via AI. The report includes:
   - Root cause (summary, explanation, severity)
   - Step-by-step fix with code snippets
   - Complete corrected code
   - "What to Learn" with concept, search query, and estimated learning time
   - Similar bug patterns to watch for
   - Personalized encouragement
4. **Learn** — Optionally, `POST /api/debug/learn` generates a lesson and a five-question quiz on the underlying concept.
5. **Track** — The session and error category are saved to Supabase. Weak spots are upserted to track recurring patterns.

The AI layer has three retries with exponential backoff, 25–30 second timeouts, and intelligent fallback generators so the user always gets a useful response even if the AI is unavailable.

---

## Supported Languages

JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, Swift, Kotlin, C#, HTML, CSS, SQL

---

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/debug/start` | Submit code + error, get 3 clarifying questions |
| POST | `/api/debug/complete` | Submit answers, get full debug report |
| POST | `/api/debug/learn` | Generate lesson + quiz for a concept |
| POST | `/api/debug/search` | AI-powered contextual search |
| GET | `/api/sessions` | List user's debug sessions (paginated) |
| GET/DELETE | `/api/sessions/[id]` | Get or delete a specific session |
| GET/PATCH | `/api/user` | Get or update user profile |
| GET | `/api/user/weak-spots` | Get user's weak spot patterns |

---

## Database Tables

| Table | Description |
|---|---|
| `users` | User profiles (clerk_id, email, plan, sessions_used, sessions_limit, Razorpay IDs) |
| `debug_sessions` | Saved debug sessions (user_id, language, code, error_message, debug_report, status) |
| `weak_spots` | Recurring error pattern tracking (user_id, error_category, language, occurrence_count) |
| `subscriptions` | Razorpay subscription records |

---

## Architecture Decisions

1. **AI with fallbacks** — If Groq/LLaMA fails after three retries, the app generates smart fallback questions and reports based on error message analysis. The user is never blocked.
2. **Redis + in-memory** — Sessions are stored in both Redis and an in-memory Map. If Redis is unavailable, the in-memory store takes over seamlessly.
3. **Lazy initialization** — All external clients (Groq, Redis, Razorpay, Supabase) use lazy singletons to avoid crashing at build time when environment variables are not available.
4. **Input security** — Zod validation and malicious pattern detection (XSS, SQL injection) are applied to all user inputs before they reach the AI.
5. **Rate limiting per plan** — Free: 20 req/hr, Pro: 100 req/hr, Bootcamp: 200 req/hr using Upstash sliding window.
6. **Session recovery** — If a debug session expires mid-flow, the frontend can auto-recover by re-submitting the cached code and error to create a new session.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/dev-priyanshu15/DebugMate.git
cd DebugMate
npm install --legacy-peer-deps
```

### Environment Variables

Create a `.env.local` file in the root of the project and populate the following variables:

```env
# Clerk (Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Groq (AI/LLM)
GROQ_API_KEY=

# Upstash (Redis + Rate Limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Razorpay (Payments)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_PRO_MONTHLY_PLAN_ID=
RAZORPAY_PRO_YEARLY_PLAN_ID=
RAZORPAY_BOOTCAMP_MONTHLY_PLAN_ID=

# App
NEXT_PUBLIC_APP_URL=
```

### Running Locally

```bash
npm run dev
```

The development server starts at `http://localhost:3000`.

---

## NPM Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm run docker:build` | Build Docker image |
| `npm run docker:run` | Run with docker-compose |
| `npm run docker:dev` | Run dev environment with docker-compose |
| `npm run docker:stop` | Stop docker-compose |

---

## Docker

DebugMate ships with a three-stage Dockerfile:

- **Stage 1 (deps):** `node:20-alpine` — installs dependencies with `npm ci --legacy-peer-deps`
- **Stage 2 (builder):** Copies dependencies and source, injects `NEXT_PUBLIC_*` build args, runs `npm run build`
- **Stage 3 (runner):** `node:20-alpine` — runs as a non-root `nextjs` user, copies standalone output and static files, exposes port 3000

```bash
# Build and run with Docker Compose
npm run docker:build
npm run docker:run
```

---

## Screenshots

<!-- Add screenshot here -->

---

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please ensure your code passes linting (`npm run lint`) and type checking (`npm run type-check`) before submitting.

---

## License

This project is licensed under the [MIT License](LICENSE).
