# Dev Growth Tracker - Setup Guide

Complete setup guide for the dev-growth-tracker MVP.

---

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account ([https://supabase.com](https://supabase.com))
- GitHub account (for OAuth authentication)

---

## Step 1: Clone and Install Dependencies

```bash
cd dev-growth-tracker
pnpm install
```

---

## Step 2: Supabase Project Setup

### 2.1 Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: `dev-growth-tracker`
   - Database Password: (save this securely)
   - Region: (choose closest to you)
4. Wait for project to be provisioned (~2 minutes)

### 2.2 Run Database Migration

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify success message appears

### 2.3 Verify Database Setup

Navigate to **Table Editor**:
- ✅ Should see 4 tables: `profiles`, `tasks`, `xp_logs`, `github_sync_logs`

Navigate to **Database** → **Functions**:
- ✅ Should see 9 functions including `complete_task_with_xp`, `award_github_xp`, etc.

---

## Step 3: Configure GitHub OAuth

### 3.1 Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: `Dev Growth Tracker`
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: Get from Supabase (see next step)
4. Click **Register application**
5. Note down **Client ID** and **Client Secret**

### 3.2 Get Supabase Callback URL

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **GitHub** provider
3. Copy the **Callback URL (for OAuth)**
   - Format: `https://<project-ref>.supabase.co/auth/v1/callback`

### 3.3 Configure GitHub Provider in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **GitHub**
3. Enter:
   - **Client ID**: (from GitHub OAuth App)
   - **Client Secret**: (from GitHub OAuth App)
4. Click **Save**

---

## Step 4: Environment Variables

### 4.1 Get Supabase Credentials

1. In Supabase Dashboard, go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (under "Project URL")
   - **anon/public** key (under "Project API keys")

### 4.2 Update `.env.local`

The file should already exist with placeholders. Update it:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace:
- `your-project-ref` with your actual project reference
- `your-anon-key-here` with your actual anon key

---

## Step 5: Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Login page with GitHub button
- ✅ No console errors

---

## Step 6: First Login Test

1. Click "Continue with GitHub"
2. Authorize the application
3. Should redirect to `/dashboard`
4. Dashboard should load (might show loading state initially)

### Verify Profile Creation

1. Go to Supabase Dashboard → **Table Editor** → **profiles**
2. You should see your profile created automatically
3. Check fields:
   - `id`: Your user ID
   - `username`: From GitHub
   - `level`: 1
   - `total_xp`: 0
   - All other XP fields: 0

---

## Step 7: Update GitHub Username (Optional)

If your profile doesn't have `github_username` set:

1. In Supabase Dashboard → **Table Editor** → **profiles**
2. Find your profile row
3. Edit `github_username` column
4. Enter your GitHub username
5. Save

Or use SQL:

```sql
UPDATE profiles
SET github_username = 'your-github-username'
WHERE id = 'your-user-id';
```

---

## Step 8: Test Basic Functionality

### Create a Task

1. On dashboard, enter task title: "Test task"
2. Select category: "Coding" (15 XP)
3. Click "Create Task"
4. ✅ Task appears in pending list

### Complete a Task

1. Click "Complete" on the task
2. ✅ Task moves to "Completed Today"
3. ✅ XP increases to 15
4. ✅ Level card shows progress
5. ✅ Today's XP shows 15/100
6. ✅ Streak becomes 1

### Sync GitHub

1. Make a commit to any public repo
2. Click "Sync GitHub Commits"
3. ✅ Shows sync result
4. ✅ XP increases
5. ✅ Category breakdown shows GitHub XP

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution**: Verify `.env.local` exists and has correct values. Restart dev server after updating.

### Issue: Login redirects to error page

**Solution**:
1. Check GitHub OAuth callback URL matches Supabase
2. Verify GitHub OAuth app is enabled
3. Check Supabase GitHub provider is configured correctly

### Issue: Profile not created after login

**Solution**:
```sql
-- Manually create profile
INSERT INTO profiles (id, username)
VALUES ('your-user-id', 'your-username');
```

### Issue: Tasks not loading

**Solution**:
1. Check browser console for errors
2. Verify RLS policies are enabled in Supabase
3. Check you're authenticated (try signing out and back in)

### Issue: XP not updating after completing task

**Solution**:
1. Check Supabase Logs for errors
2. Verify `complete_task_with_xp` function exists
3. Check `xp_logs` table for entries

### Issue: GitHub sync fails

**Solution**:
1. Verify `github_username` is set in your profile
2. Check username spelling (case-sensitive)
3. Ensure you have public repos with commits
4. Check GitHub API isn't rate-limited

---

## Production Deployment (Vercel)

### 1. Update GitHub OAuth App

Add production callback URL:
- **Homepage URL**: `https://your-domain.vercel.app`
- **Authorization callback URL**: Keep both dev and prod URLs

Or create a separate production OAuth app.

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Update Supabase Settings

1. Add production URL to Supabase **Authentication** → **URL Configuration**
2. Add to **Site URL** and **Redirect URLs**

---

## File Structure Overview

```
dev-growth-tracker/
├── src/
│   ├── app/
│   │   ├── (auth)/login/          # Login page
│   │   ├── (main)/dashboard/      # Dashboard page
│   │   └── auth/callback/         # OAuth callback
│   ├── screens/
│   │   ├── auth/login/            # Login screen logic
│   │   └── main/dashboard/        # Dashboard screen + components
│   ├── actions/                   # Server actions
│   │   ├── tasks/                 # Task CRUD operations
│   │   ├── github/                # GitHub sync
│   │   └── profile/               # Profile operations
│   ├── components/ui/             # shadcn components
│   ├── constants/                 # XP values, query keys
│   ├── lib/
│   │   ├── supabase/              # Supabase clients
│   │   └── xp/                    # XP calculation utils
│   └── hooks/                     # Global hooks
├── supabase/
│   ├── migrations/                # Database migrations
│   └── README.md                  # Database setup guide
├── .env.local                     # Environment variables
└── TESTING.md                     # Testing guide
```

---

## Next Steps

1. ✅ Complete [TESTING.md](./TESTING.md) scenarios
2. ✅ Deploy to production
3. ✅ Monitor error logs
4. ✅ Gather user feedback
5. ✅ Plan Phase 2 features

---

## Support

For issues:
1. Check [TESTING.md](./TESTING.md) troubleshooting section
2. Check Supabase logs for database errors
3. Check browser console for client errors
4. Review [supabase/README.md](./supabase/README.md) for database setup

---

## Key Concepts

### XP System
- **Daily Cap**: 100 XP total
- **GitHub Priority**: GitHub XP (max 30) calculated first
- **Task Categories**: coding (15), learning (12), writing (10), health (8)
- **GitHub Commits**: 5 XP per commit

### Levels
- Formula: `nextLevelXp = 100 * (level ^ 1.5)`
- Level 1→2: 100 XP
- Level 2→3: 282 XP (cumulative)
- Level 3→4: 519 XP (cumulative)

### Streaks
- Only Task completion counts (GitHub doesn't affect streak)
- Consecutive days increment
- Gaps reset to 1
- Longest streak preserved

### Timezone
- All dates in KST (UTC+9)
- Daily cap resets at midnight KST
- GitHub sync uses KST for "today"

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint

# Add shadcn component
pnpm dlx shadcn@latest add <component>
```

---

## Success Checklist

- [ ] Database schema deployed
- [ ] GitHub OAuth configured
- [ ] Environment variables set
- [ ] Can log in with GitHub
- [ ] Profile auto-created
- [ ] Can create tasks
- [ ] Can complete tasks and earn XP
- [ ] Level system works
- [ ] Streak increments correctly
- [ ] GitHub sync works
- [ ] Daily cap enforced
- [ ] All UI components display correctly

---

Congratulations! Your dev-growth-tracker MVP is ready to use! 🎉
