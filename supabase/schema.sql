-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'bootcamp')),
  sessions_used INTEGER NOT NULL DEFAULT 0,
  sessions_limit INTEGER NOT NULL DEFAULT 10,
  sessions_reset_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'inactive',
  subscription_ends_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SESSIONS TABLE
CREATE TABLE debug_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  error_message TEXT NOT NULL,
  clarifying_questions JSONB,
  user_answers JSONB,
  debug_report JSONB,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'clarifying', 'complete', 'failed')),
  ai_tokens_used INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  public_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- WEAK SPOTS TABLE
CREATE TABLE weak_spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  error_category TEXT NOT NULL,
  language TEXT NOT NULL,
  occurrence_count INTEGER NOT NULL DEFAULT 1,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  related_concept TEXT,
  UNIQUE(user_id, error_category, language)
);

-- SUBSCRIPTIONS TABLE
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BOOTCAMP TEAMS TABLE
CREATE TABLE bootcamp_teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  seats_total INTEGER NOT NULL DEFAULT 50,
  seats_used INTEGER NOT NULL DEFAULT 0,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- BOOTCAMP MEMBERS TABLE
CREATE TABLE bootcamp_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES bootcamp_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- ROW LEVEL SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE debug_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weak_spots ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_id = auth.jwt()->>'sub');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (clerk_id = auth.jwt()->>'sub');

-- Users can only see their own sessions (or public ones)
CREATE POLICY "Users can view own sessions" ON debug_sessions
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
    OR is_public = TRUE
  );

CREATE POLICY "Users can insert own sessions" ON debug_sessions
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
  );

-- Users can only see their own weak spots
CREATE POLICY "Users can view own weak spots" ON weak_spots
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE clerk_id = auth.jwt()->>'sub')
  );

-- INDEXES
CREATE INDEX idx_debug_sessions_user_id ON debug_sessions(user_id);
CREATE INDEX idx_debug_sessions_created_at ON debug_sessions(created_at DESC);
CREATE INDEX idx_weak_spots_user_id ON weak_spots(user_id);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- AUTO UPDATE updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON debug_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Helper function to increment sessions_used
CREATE OR REPLACE FUNCTION increment_sessions_used(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE users SET sessions_used = sessions_used + 1 WHERE id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function to increment weak spot occurrence
CREATE OR REPLACE FUNCTION increment_weak_spot(
  p_user_id UUID,
  p_error_category TEXT,
  p_language TEXT
)
RETURNS void AS $$
BEGIN
  UPDATE weak_spots
  SET occurrence_count = occurrence_count + 1,
      last_seen_at = NOW()
  WHERE user_id = p_user_id
    AND error_category = p_error_category
    AND language = p_language;
END;
$$ LANGUAGE plpgsql;
