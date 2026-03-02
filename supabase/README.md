# Supabase Database Setup

## Phase 1: Database Schema Setup

This guide will help you set up the database schema for the dev-growth-tracker application.

### Prerequisites

1. A Supabase project created at [https://app.supabase.com](https://app.supabase.com)
2. Your Supabase project URL and anon key configured in `.env.local`

### Step 1: Run the Initial Schema Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy the entire contents of `migrations/001_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **Run** (or press Cmd/Ctrl + Enter)

This will create:
- ✅ 4 tables: `profiles`, `tasks`, `xp_logs`, `github_sync_logs`
- ✅ Row Level Security (RLS) policies on all tables
- ✅ Indexes for query optimization
- ✅ Database functions for XP calculation and task completion
- ✅ Triggers for auto-creating user profiles and updating timestamps

### Step 2: Verify the Setup

After running the migration, verify in the Supabase Dashboard:

#### Check Tables
1. Go to **Table Editor** (left sidebar)
2. You should see 4 tables:
   - `profiles`
   - `tasks`
   - `xp_logs`
   - `github_sync_logs`

#### Check RLS Policies
1. Click on any table
2. Go to the **Policies** tab
3. Verify that policies are enabled and listed

#### Check Functions
1. Go to **Database** → **Functions** (in the sidebar)
2. You should see these functions:
   - `get_task_xp(p_category)`
   - `calculate_level(p_total_xp)`
   - `get_today_xp_total(p_user_id)`
   - `get_today_github_xp(p_user_id)`
   - `update_user_streak(p_user_id)`
   - `complete_task_with_xp(p_task_id, p_user_id)`
   - `award_github_xp(p_user_id, p_commit_count, p_sync_date)`
   - `handle_new_user()`
   - `update_updated_at_column()`

### Step 3: Test User Creation

To verify the trigger works correctly:

1. Go to **Authentication** → **Users**
2. If you haven't already, create a test user account
3. Go to **Table Editor** → **profiles**
4. Verify that a profile was automatically created for the user

### Step 4: Configure GitHub OAuth (for Phase 3)

This will be needed later for authentication:

1. Go to **Authentication** → **Providers**
2. Enable **GitHub** provider
3. Follow the instructions to create a GitHub OAuth App
4. Add the Client ID and Client Secret to Supabase

### Database Schema Overview

#### Tables

**profiles**
- Stores user level, XP, and streak data
- Auto-created on user signup via trigger
- All XP calculations update this table

**tasks**
- User tasks with category (coding, learning, writing, health)
- Status: pending, completed, deleted
- XP reward based on category

**xp_logs**
- Immutable audit log of all XP transactions
- Prevents duplicate XP awards with unique constraint
- Tracks daily totals for cap enforcement

**github_sync_logs**
- One record per user per day
- Tracks commit count and XP awarded from GitHub
- Used for daily GitHub XP cap (max 30 XP/day)

#### Key Features

**XP System**
- Daily cap: 100 XP total (GitHub max 30 XP, rest from Tasks)
- GitHub XP calculated first, Tasks use remaining cap
- Level formula: `nextLevelXp = 100 * (level ^ 1.5)`

**Streak System**
- Only Task completion counts (GitHub sync doesn't affect streak)
- Consecutive days increment streak
- Gap of more than 1 day resets streak to 1

**Security**
- All tables have RLS enabled
- Users can only access their own data
- XP logs are read-only for users (INSERT via functions only)
- Server functions enforce all business logic

**Timezone**
- MVP: All dates use KST (Asia/Seoul) timezone
- Future: Can add timezone field to profiles table

### Troubleshooting

**Migration fails**
- Make sure you're running the entire SQL file, not partial snippets
- Check for any existing tables with the same names
- Verify you have proper permissions on your Supabase project

**Trigger doesn't create profile**
- Check if the trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Manually create a profile if needed (temporary workaround)

**RLS blocks queries**
- Verify the user is authenticated
- Check that `auth.uid()` matches the `user_id` in the query
- Review policies in the Table Editor

### Next Steps

After completing Phase 1:
- ✅ Proceed to Phase 2: Create folder structure
- ✅ Proceed to Phase 3: Implement authentication
- ✅ TypeScript types are already updated in `src/lib/supabase/database.types.ts`

### Regenerating Types (Optional)

If you modify the database schema later, regenerate types with:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
npx supabase login

# Generate types (replace with your project ref from the URL)
npx supabase gen types typescript --project-id <your-project-ref> > src/lib/supabase/database.types.ts
```

Your project ref can be found in:
- Your Supabase project URL: `https://nuocnkoiltcziplcdtwt.supabase.co`
- The ref is: `nuocnkoiltcziplcdtwt`
