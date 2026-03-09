# DebugMate

**Not Just The Fix. The Understanding.**

Live at [debugmate-gamma.vercel.app](https://debugmate-gamma.vercel.app)

DebugMate is a full-stack AI-powered debugging assistant built with Next.js 14 App Router. It helps developers understand why their code broke, not just how to fix it. You paste buggy code and an error message, the AI asks three targeted clarifying questions, then produces a structured debug report covering root cause analysis, step-by-step fixes, corrected code, learning resources, similar bug patterns, and a note on what to study next. Sessions are saved, weak spots are tracked over time, and the whole thing degrades gracefully if any external service goes down.

---

## Features

- **AI debug reports** — Root cause analysis, numbered fix steps with code snippets, complete corrected code, and learning resources, powered by LLaMA 3.3 70B via Groq
- **Clarifying questions** — Three targeted AI-generated questions collected before the report is generated, so the output is specific rather than generic
- **Learn and quiz mode** — After debugging, users can read a short lesson and take a five-question quiz on the underlying concept
- **Weak spots tracking** — Recurring error categories are tracked per user with occurrence counts, so patterns become visible over time
- **Session history** — All completed debug sessions are stored in Supabase and browsable from a dashboard
- **Subscription plans** — Free, Pro, and Bootcamp tiers with per-plan rate limits, managed through Razorpay
- **15 supported languages** — JavaScript, TypeScript, Python, Java, C++, Rust, Go, PHP, Ruby, Swift, Kotlin, C#, HTML, CSS, SQL
- **Resilient by design** — Three retries with exponential backoff on all AI calls, in-memory fallback when Redis is unavailable, and intelligent fallback report generators so users are never left with a blank screen

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript (strict mode) |
| Auth | Clerk v5 (`@clerk/nextjs ^5.7.5`) |
| Database | Supabase — PostgreSQL (`@supabase/supabase-js ^2.96`) |
| AI / LLM | Groq SDK (`groq-sdk ^0.37`) — model `llama-3.3-70b-versatile` |
| Caching | Upstash Redis (`@upstash/redis ^1.36`) with in-memory Map fallback |
| Rate limiting | Upstash Ratelimit (`@upstash/ratelimit ^2.0`) — sliding window per plan |
| Payments | Razorpay (`razorpay ^2.9`) |
| UI components | Radix UI primitives, Tailwind CSS 3.4, Framer Motion 11 |
| Code editor | Monaco Editor (`@monaco-editor/react ^4.7`) |
| Charts | Recharts (`recharts ^2.15`) |
| State management | Zustand 5 — persisted debug session state |
| Data fetching | TanStack React Query 5 |
| Validation | Zod 3.24 — schemas and malicious pattern detection |
| Error monitoring | Sentry (`@sentry/nextjs ^8.55`) |
| Analytics | PostHog (`posthog-js`) |
| Email | Resend (`resend ^4.8`) |
| Webhooks | Svix — Clerk webhook signature verification |
| Styling | Tailwind CSS with CSS custom properties, dark/light theme via `next-themes` |
| Containerization | Docker — three-stage multi-stage build, docker-compose for prod and dev |
| Deployment | Vercel (primary), Fly.io (`sin` region, 512 MB shared CPU) |

---

## Project Structure

```
debugmate/
├── app/
│   ├── layout.tsx                    # Root layout — ClerkProvider, ThemeProvider, QueryProvider
│   ├── globals.css                   # CSS variables for dark and light theme
│   ├── (app)/                        # Authenticated routes behind Sidebar layout
│   │   ├── layout.tsx                # Sidebar + main content wrapper
│   │   ├── dashboard/                # Session history dashboard
│   │   ├── debug/
│   │   │   ├── new/page.tsx          # Three-step debug flow: Input, Clarify, Report
│   │   │   └── [sessionId]/page.tsx  # View a saved debug session
│   │   └── weak-spots/page.tsx       # Weak spots tracking with charts
│   ├── (auth)/                       # Clerk sign-in and sign-up pages
│   ├── (marketing)/                  # Public landing page, pricing, blog
│   └── api/
│       ├── debug/
│       │   ├── start/route.ts        # POST — submit code + error, receive clarifying questions
│       │   ├── complete/route.ts     # POST — submit answers, receive full debug report
│       │   ├── learn/route.ts        # POST — generate lesson + quiz for a concept
│       │   └── search/route.ts       # POST — AI-powered contextual search
│       ├── sessions/
│       │   ├── route.ts              # GET — list user sessions (paginated)
│       │   └── [id]/route.ts         # GET / DELETE — retrieve or delete a session
│       ├── user/
│       │   ├── route.ts              # GET / PATCH — read or update user profile
│       │   └── weak-spots/route.ts   # GET — user's weak spot patterns
│       └── webhooks/
│           ├── clerk/route.ts        # Clerk user.created / updated / deleted events
│           └── razorpay/route.ts     # Razorpay subscription lifecycle events
├── components/
│   ├── debug/                        # Debug flow UI components
│   ├── dashboard/                    # Dashboard-specific components
│   ├── marketing/                    # Landing page components
│   ├── shared/                       # Navbar, Sidebar, and other shared components
│   └── providers/                    # React context providers
├── hooks/
│   ├── useDebugSession.ts            # Zustand store for debug flow state (persisted)
│   ├── useUser.ts                    # React Query hook for user data
│   └── useWeakSpots.ts               # React Query hook for weak spots
├── lib/
│   ├── anthropic.ts                  # AI service using Groq/LLaMA — question and report generation
│   ├── redis.ts                      # Upstash Redis cache with in-memory fallback
│   ├── session-store.ts              # In-memory session Map with TTL expiry
│   ├── rate-limit.ts                 # Per-plan sliding window rate limiting
│   ├── get-or-create-user.ts         # Auto-provision user row in Supabase on first sign-in
│   ├── razorpay.ts                   # Razorpay client, subscription helpers, webhook verification
│   ├── validations.ts                # Zod schemas and security pattern detection
│   ├── utils.ts                      # Formatting helpers, icon maps, sanitization utilities
│   └── supabase/
│       ├── server.ts                 # Server-side Supabase client (service role key)
│       └── client.ts                 # Browser-side Supabase client (anon key)
├── types/
│   └── index.ts                      # All TypeScript interfaces and types
├── middleware.ts                      # Clerk auth middleware — public and protected route config
├── Dockerfile                        # Multi-stage Docker build: deps, builder, runner
├── docker-compose.yml                # Production docker-compose
├── docker-compose.dev.yml            # Development docker-compose with hot reload and local Redis
├── fly.toml                          # Fly.io deployment configuration (Singapore region)
├── next.config.js                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration with CSS variable theme
├── tsconfig.json                     # TypeScript config — strict mode, bundler module resolution
└── package.json                      # Dependencies and npm scripts
```

---

## How the Debug Flow Works

The debug flow is a three-step process, each step backed by a dedicated API route.

**Step 1 — Input**

The user selects one of 15 supported languages, pastes buggy code (between 10 and 10,000 characters), and types the error message.

**Step 2 — Clarify**

`POST /api/debug/start` sends the code and error to the Groq API running `llama-3.3-70b-versatile`. The model returns exactly three targeted clarifying questions and an error category classification. The session data is cached in Upstash Redis with a 30-minute TTL, and simultaneously written to an in-memory Map as a fallback. The three questions are displayed to the user.

**Step 3 — Report**

`POST /api/debug/complete` receives the user's three answers, loads the cached session, and asks the model to produce a full debug report structured as JSON. The report contains:

- `rootCause` — one-sentence summary, two-to-three sentence plain-English explanation, and a severity level (low, medium, or high)
- `stepByStepFix` — numbered steps, each with an instruction, an optional code snippet, and an explanation of why that step matters
- `fixedCode` — the complete corrected version of the submitted code
- `whatToLearn` — the underlying concept, why it matters, a search query to learn more, and an estimated learning time
- `similarBugs` — real patterns the developer should watch for, with examples and avoidance strategies
- `encouragement` — one personalized sentence

**Optional — Learn**

`POST /api/debug/learn` generates a full lesson (multiple teaching paragraphs, code examples, and key takeaways) plus a five-question multiple-choice quiz on the concept surfaced during debugging.

**Persistence**

Once a report is generated, the session is saved to the `debug_sessions` table in Supabase and the error category is upserted into `weak_spots` to track recurring patterns.

**Resilience**

All AI calls go through a retry wrapper with up to three attempts, exponential backoff starting at 1500 ms, jitter, and 20–30 second per-attempt timeouts. If all attempts fail, the AI layer returns a fallback response generated from error message analysis — the user always gets something useful.

---

## API Routes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/debug/start` | Required | Submit code and error message, receive three clarifying questions |
| POST | `/api/debug/complete` | Required | Submit answers to clarifying questions, receive full debug report |
| POST | `/api/debug/learn` | Required | Generate lesson and five-question quiz for a concept |
| POST | `/api/debug/search` | Required | AI-powered contextual search within debug context |
| GET | `/api/sessions` | Required | List user's debug sessions with pagination |
| GET | `/api/sessions/[id]` | Required | Retrieve a specific session |
| DELETE | `/api/sessions/[id]` | Required | Delete a specific session |
| GET | `/api/user` | Required | Get user profile |
| PATCH | `/api/user` | Required | Update user profile |
| GET | `/api/user/weak-spots` | Required | Get user's weak spot patterns |
| POST | `/api/webhooks/clerk` | Public | Clerk user lifecycle webhook handler |
| POST | `/api/webhooks/razorpay` | Public | Razorpay subscription webhook handler |

The routes `/`, `/pricing`, `/blog`, `/sign-in`, `/sign-up`, and `/debug/[slug]` (public shared sessions) are unauthenticated. Everything else requires a valid Clerk session.

---

## Database Schema

| Table | Key Columns |
|---|---|
| `users` | `id`, `clerk_id`, `email`, `full_name`, `plan` (free/pro/bootcamp), `sessions_used`, `sessions_limit`, `sessions_reset_at`, `razorpay_customer_id`, `razorpay_subscription_id`, `subscription_status`, `onboarding_completed` |
| `debug_sessions` | `id`, `user_id`, `language`, `code`, `error_message`, `clarifying_questions`, `user_answers`, `debug_report`, `status` (pending/clarifying/complete/failed), `is_public`, `public_slug` |
| `weak_spots` | `id`, `user_id`, `error_category`, `language`, `occurrence_count`, `last_seen_at`, `related_concept` |
| `subscriptions` | `id`, `user_id`, `razorpay_subscription_id`, `plan`, `status`, `current_period_start`, `current_period_end` |

---

## Architecture Notes

**AI with fallbacks**

The AI layer in `lib/anthropic.ts` uses Groq's `llama-3.3-70b-versatile` (despite the file being named `anthropic.ts` — a legacy artifact). If the model fails after three retries, the code generates fallback questions and fallback reports by analyzing the error message string directly. This means the debug flow never completely fails for the user.

**Redis plus in-memory caching**

`lib/redis.ts` writes every session to both Upstash Redis and an in-memory `Map` in `lib/session-store.ts`. On read, Redis is tried first; if it is unavailable or the key is missing, the in-memory store is consulted. The in-memory store does TTL-based expiry on access, not on a background timer.

**Lazy client initialization**

All external SDK clients (Groq, Razorpay, Supabase service role) are initialized on first use, not at module load time. This prevents the Next.js build from failing when environment variables are not present in CI or edge runtimes.

**Input validation and security**

`lib/validations.ts` runs Zod validation on all API input and applies pattern detection for XSS and SQL injection sequences before any user-supplied content reaches the AI or the database.

**Rate limiting per plan**

Rate limits are enforced per user using Upstash's sliding window algorithm. Free plan users have a tighter limit than Pro and Bootcamp users. The exact values are defined in `lib/rate-limit.ts`.

**Session recovery**

If a session expires from the cache mid-flow (after the TTL), the Zustand store on the frontend retains enough state to re-submit the original code and error and create a new session transparently.

---

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm

### Installation

```bash
git clone https://github.com/dev-priyanshu15/DebugMate.git
cd DebugMate
npm install --legacy-peer-deps
```

### Environment Variables

Create `.env.local` in the project root with the following variables:

```env
# Clerk — authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Supabase — database
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Groq — AI / LLM
GROQ_API_KEY=

# Upstash — Redis caching and rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Razorpay — payments
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_PRO_MONTHLY_PLAN_ID=
RAZORPAY_PRO_YEARLY_PLAN_ID=
RAZORPAY_BOOTCAMP_MONTHLY_PLAN_ID=

# Application
NEXT_PUBLIC_APP_URL=
```

`NEXT_PUBLIC_*` variables are embedded at build time by Next.js. The remaining variables are only ever read at runtime on the server side.

### Running Locally

```bash
npm run dev
```

The development server starts at `http://localhost:3000`.

---

## Available Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Next.js development server with hot reload |
| `npm run build` | Run a production build |
| `npm run start` | Start the production server (requires a completed build) |
| `npm run lint` | Run ESLint across the project |
| `npm run type-check` | Run TypeScript type checking without emitting files |
| `npm run docker:build` | Build the Docker image |
| `npm run docker:run` | Start the production stack with docker-compose |
| `npm run docker:dev` | Start the development stack with hot reload and a local Redis container |
| `npm run docker:stop` | Stop and remove docker-compose containers |

---

## Docker

The repository ships with a three-stage Dockerfile optimized for size and build caching.

**Stage 1 — deps**

Uses `node:20-alpine` as a base and runs `npm ci --legacy-peer-deps` to produce a clean `node_modules` directory.

**Stage 2 — builder**

Copies dependencies from stage 1 and the full source tree, then accepts all `NEXT_PUBLIC_*` variables as build arguments and runs `npm run build`. The standalone output mode is enabled in `next.config.js`, which produces a self-contained server bundle.

**Stage 3 — runner**

Copies only the standalone build, static assets, and public directory from stage 2. Runs as a non-root `nextjs` user in the `nodejs` group. Exposes port 3000.

```bash
# Build the image and start the stack
npm run docker:build
npm run docker:run
```

The development compose file (`docker-compose.dev.yml`) mounts the source directory as a volume, starts the app using the `deps` target with `npm run dev`, and spins up a `redis:7-alpine` container on port 6379 for local caching.

---

## Deployment

**Vercel (primary)**

The application deploys to Vercel automatically on push to the main branch. The live URL is [https://debugmate-gamma.vercel.app](https://debugmate-gamma.vercel.app). Set all environment variables in the Vercel project settings. The `NEXT_PUBLIC_*` variables must be added as build-time variables, not just runtime secrets.

**Fly.io (secondary)**

The `fly.toml` in the repository configures a deployment to the `sin` (Singapore) region with a 512 MB shared-CPU VM, a minimum of one always-on machine, and HTTPS forced on port 3000. To deploy:

```bash
fly deploy
```

---

## Contributing

Contributions are welcome. The process is straightforward:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run linting and type checking before committing: `npm run lint && npm run type-check`
5. Push the branch and open a pull request against `main`

Please keep pull requests focused on a single concern. If you are fixing a bug, include a description of what was broken and how the fix addresses it.

---

## License

This project is licensed under the [MIT License](LICENSE).
