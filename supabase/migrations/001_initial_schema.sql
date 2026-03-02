-- =============================================
-- Phase 1: Database Foundation
-- dev-growth-tracker MVP Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. TABLES
-- =============================================

-- Profiles table: User profile with XP and level data
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  github_username TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,

  -- Category XP breakdown
  coding_xp INTEGER NOT NULL DEFAULT 0,
  learning_xp INTEGER NOT NULL DEFAULT 0,
  writing_xp INTEGER NOT NULL DEFAULT 0,
  health_xp INTEGER NOT NULL DEFAULT 0,
  github_xp INTEGER NOT NULL DEFAULT 0,

  -- Streak tracking
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Tasks table: User tasks with category and status
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('coding', 'learning', 'writing', 'health')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'deleted')),
  xp_reward INTEGER NOT NULL,

  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 200)
);

-- XP Logs table: Immutable log of all XP changes
CREATE TABLE IF NOT EXISTS xp_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('task', 'github')),
  source_id UUID, -- task_id or github_sync_log_id
  category TEXT NOT NULL,
  xp_amount INTEGER NOT NULL,

  -- Metadata
  daily_total INTEGER NOT NULL, -- Total XP earned today after this transaction
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Prevent duplicate XP for same task
  CONSTRAINT unique_task_xp UNIQUE (source_type, source_id)
);

-- GitHub Sync Logs table: Daily GitHub commit tracking
CREATE TABLE IF NOT EXISTS github_sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_date DATE NOT NULL,
  commit_count INTEGER NOT NULL DEFAULT 0,
  xp_awarded INTEGER NOT NULL DEFAULT 0,

  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One sync per user per day
  CONSTRAINT unique_daily_sync UNIQUE (user_id, sync_date)
);

-- =============================================
-- 2. INDEXES
-- =============================================

-- Tasks indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_completed_at ON tasks(completed_at) WHERE completed_at IS NOT NULL;

-- XP Logs indexes
CREATE INDEX idx_xp_logs_user_id ON xp_logs(user_id);
CREATE INDEX idx_xp_logs_created_at ON xp_logs(created_at);
CREATE INDEX idx_xp_logs_user_date ON xp_logs(user_id, created_at);

-- GitHub Sync Logs indexes
CREATE INDEX idx_github_sync_user_date ON github_sync_logs(user_id, sync_date);

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_sync_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- XP Logs policies (read-only for users)
CREATE POLICY "Users can view own xp logs"
  ON xp_logs FOR SELECT
  USING (auth.uid() = user_id);

-- GitHub Sync Logs policies
CREATE POLICY "Users can view own github sync logs"
  ON github_sync_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own github sync logs"
  ON github_sync_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 4. HELPER FUNCTIONS
-- =============================================

-- Function: Get XP value for a task category
CREATE OR REPLACE FUNCTION get_task_xp(p_category TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_category
    WHEN 'coding' THEN 15
    WHEN 'learning' THEN 12
    WHEN 'writing' THEN 10
    WHEN 'health' THEN 8
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Calculate level from total XP
-- Formula: nextLevelXp = 100 * (level ^ 1.5)
CREATE OR REPLACE FUNCTION calculate_level(p_total_xp INTEGER)
RETURNS INTEGER AS $$
DECLARE
  v_level INTEGER := 1;
  v_xp_needed INTEGER := 0;
BEGIN
  WHILE p_total_xp >= v_xp_needed LOOP
    v_level := v_level + 1;
    v_xp_needed := FLOOR(100 * POWER(v_level, 1.5));
  END LOOP;

  RETURN v_level - 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function: Get today's total XP for a user (KST timezone)
CREATE OR REPLACE FUNCTION get_today_xp_total(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_today_start TIMESTAMPTZ;
  v_today_end TIMESTAMPTZ;
  v_total INTEGER;
BEGIN
  -- Calculate today in KST (UTC+9)
  v_today_start := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE::TIMESTAMPTZ AT TIME ZONE 'Asia/Seoul';
  v_today_end := v_today_start + INTERVAL '1 day';

  SELECT COALESCE(SUM(xp_amount), 0) INTO v_total
  FROM xp_logs
  WHERE user_id = p_user_id
    AND created_at >= v_today_start
    AND created_at < v_today_end;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql;

-- Function: Get today's GitHub XP for a user (KST timezone)
CREATE OR REPLACE FUNCTION get_today_github_xp(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_today DATE;
  v_github_xp INTEGER;
BEGIN
  -- Get today in KST
  v_today := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;

  SELECT COALESCE(xp_awarded, 0) INTO v_github_xp
  FROM github_sync_logs
  WHERE user_id = p_user_id
    AND sync_date = v_today;

  RETURN v_github_xp;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 5. CORE FUNCTIONS
-- =============================================

-- Function: Update user streak (called after task completion)
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_today DATE;
  v_last_active DATE;
  v_current_streak INTEGER;
BEGIN
  -- Get today in KST
  v_today := (NOW() AT TIME ZONE 'Asia/Seoul')::DATE;

  -- Get current streak and last active date
  SELECT current_streak, last_active_date
  INTO v_current_streak, v_last_active
  FROM profiles
  WHERE id = p_user_id;

  -- If already active today, skip
  IF v_last_active = v_today THEN
    RETURN;
  END IF;

  -- Check streak continuation
  IF v_last_active IS NULL THEN
    -- First activity ever
    v_current_streak := 1;
  ELSIF v_last_active = v_today - INTERVAL '1 day' THEN
    -- Consecutive day
    v_current_streak := v_current_streak + 1;
  ELSE
    -- Gap detected, reset streak
    v_current_streak := 1;
  END IF;

  -- Update profile
  UPDATE profiles
  SET
    current_streak = v_current_streak,
    longest_streak = GREATEST(longest_streak, v_current_streak),
    last_active_date = v_today,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function: Complete task and award XP (atomic operation)
CREATE OR REPLACE FUNCTION complete_task_with_xp(p_task_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_task RECORD;
  v_today_total INTEGER;
  v_github_xp INTEGER;
  v_remaining_cap INTEGER;
  v_actual_xp INTEGER;
  v_new_total_xp INTEGER;
  v_new_level INTEGER;
  v_category_column TEXT;
  v_result JSON;
BEGIN
  -- Get task details
  SELECT * INTO v_task
  FROM tasks
  WHERE id = p_task_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Task not found';
  END IF;

  IF v_task.status != 'pending' THEN
    RAISE EXCEPTION 'Task is not pending';
  END IF;

  -- Get today's XP usage
  v_today_total := get_today_xp_total(p_user_id);
  v_github_xp := get_today_github_xp(p_user_id);

  -- Calculate remaining daily cap (GitHub XP has priority)
  -- Total cap: 100, GitHub max: 30
  v_remaining_cap := 100 - v_today_total;

  IF v_remaining_cap <= 0 THEN
    -- Daily cap reached, but still mark task as complete
    v_actual_xp := 0;
  ELSE
    v_actual_xp := LEAST(v_task.xp_reward, v_remaining_cap);
  END IF;

  -- Mark task as completed
  UPDATE tasks
  SET
    status = 'completed',
    completed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_task_id;

  -- Award XP if any
  IF v_actual_xp > 0 THEN
    -- Insert XP log
    INSERT INTO xp_logs (user_id, source_type, source_id, category, xp_amount, daily_total)
    VALUES (
      p_user_id,
      'task',
      p_task_id,
      v_task.category,
      v_actual_xp,
      v_today_total + v_actual_xp
    );

    -- Determine category column name
    v_category_column := v_task.category || '_xp';

    -- Update profile XP
    EXECUTE format(
      'UPDATE profiles SET
        total_xp = total_xp + $1,
        %I = %I + $1,
        updated_at = NOW()
      WHERE id = $2',
      v_category_column, v_category_column
    ) USING v_actual_xp, p_user_id;

    -- Get new total XP and calculate level
    SELECT total_xp INTO v_new_total_xp
    FROM profiles
    WHERE id = p_user_id;

    v_new_level := calculate_level(v_new_total_xp);

    -- Update level if changed
    UPDATE profiles
    SET level = v_new_level
    WHERE id = p_user_id;
  END IF;

  -- Update streak (only Task completion counts, not GitHub)
  PERFORM update_user_streak(p_user_id);

  -- Return result
  v_result := json_build_object(
    'success', true,
    'xp_awarded', v_actual_xp,
    'requested_xp', v_task.xp_reward,
    'daily_cap_reached', v_remaining_cap <= 0,
    'today_total', v_today_total + v_actual_xp
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function: Award GitHub XP
CREATE OR REPLACE FUNCTION award_github_xp(
  p_user_id UUID,
  p_commit_count INTEGER,
  p_sync_date DATE DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_sync_date DATE;
  v_today_total INTEGER;
  v_github_xp_today INTEGER;
  v_xp_per_commit INTEGER := 5;
  v_github_max_daily INTEGER := 30;
  v_total_cap INTEGER := 100;
  v_calculated_xp INTEGER;
  v_actual_xp INTEGER;
  v_remaining_cap INTEGER;
  v_sync_log_id UUID;
  v_new_total_xp INTEGER;
  v_new_level INTEGER;
  v_result JSON;
BEGIN
  -- Use provided date or get today in KST
  v_sync_date := COALESCE(p_sync_date, (NOW() AT TIME ZONE 'Asia/Seoul')::DATE);

  -- Get today's total XP and GitHub XP
  v_today_total := get_today_xp_total(p_user_id);
  v_github_xp_today := get_today_github_xp(p_user_id);

  -- Calculate XP from commits (max 30/day for GitHub)
  v_calculated_xp := LEAST(p_commit_count * v_xp_per_commit, v_github_max_daily);

  -- Subtract already awarded GitHub XP today
  v_calculated_xp := GREATEST(0, v_calculated_xp - v_github_xp_today);

  -- Check remaining daily cap
  v_remaining_cap := v_total_cap - v_today_total;
  v_actual_xp := LEAST(v_calculated_xp, v_remaining_cap);

  IF v_actual_xp <= 0 THEN
    -- No XP to award
    v_result := json_build_object(
      'success', true,
      'xp_awarded', 0,
      'commit_count', p_commit_count,
      'daily_cap_reached', v_remaining_cap <= 0,
      'github_max_reached', v_github_xp_today >= v_github_max_daily,
      'today_total', v_today_total
    );

    RETURN v_result;
  END IF;

  -- Insert or update GitHub sync log
  INSERT INTO github_sync_logs (user_id, sync_date, commit_count, xp_awarded)
  VALUES (p_user_id, v_sync_date, p_commit_count, v_github_xp_today + v_actual_xp)
  ON CONFLICT (user_id, sync_date)
  DO UPDATE SET
    commit_count = EXCLUDED.commit_count,
    xp_awarded = EXCLUDED.xp_awarded,
    synced_at = NOW()
  RETURNING id INTO v_sync_log_id;

  -- Insert XP log
  INSERT INTO xp_logs (user_id, source_type, source_id, category, xp_amount, daily_total)
  VALUES (
    p_user_id,
    'github',
    v_sync_log_id,
    'github',
    v_actual_xp,
    v_today_total + v_actual_xp
  )
  ON CONFLICT (source_type, source_id)
  DO NOTHING;

  -- Update profile GitHub XP
  UPDATE profiles
  SET
    total_xp = total_xp + v_actual_xp,
    github_xp = github_xp + v_actual_xp,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Get new total XP and calculate level
  SELECT total_xp INTO v_new_total_xp
  FROM profiles
  WHERE id = p_user_id;

  v_new_level := calculate_level(v_new_total_xp);

  -- Update level if changed
  UPDATE profiles
  SET level = v_new_level
  WHERE id = p_user_id;

  -- Return result
  v_result := json_build_object(
    'success', true,
    'xp_awarded', v_actual_xp,
    'commit_count', p_commit_count,
    'daily_cap_reached', v_remaining_cap <= v_actual_xp,
    'github_max_reached', (v_github_xp_today + v_actual_xp) >= v_github_max_daily,
    'today_total', v_today_total + v_actual_xp
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. TRIGGERS
-- =============================================

-- Function: Handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username', 'user_' || SUBSTRING(NEW.id::TEXT, 1, 8)),
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers: Auto-update updated_at on all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- END OF MIGRATION
-- =============================================
