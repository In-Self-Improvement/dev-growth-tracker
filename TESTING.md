# Testing & Verification Guide

This guide covers end-to-end testing for the dev-growth-tracker MVP.

## Pre-Testing Checklist

### 1. Database Setup
- [ ] Run `supabase/migrations/001_initial_schema.sql` in Supabase SQL Editor
- [ ] Verify all 4 tables exist: `profiles`, `tasks`, `xp_logs`, `github_sync_logs`
- [ ] Check RLS policies are enabled on all tables
- [ ] Verify database functions exist (9 functions total)

### 2. Environment Configuration
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] GitHub OAuth provider configured in Supabase Dashboard
- [ ] Callback URL configured: `https://<your-project>.supabase.co/auth/v1/callback`

### 3. Dependencies
```bash
pnpm install
```

---

## Phase 8: Integration Testing Scenarios

### Test 1: Authentication Flow

#### Steps:
1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Should redirect to `/login`
4. Click "Continue with GitHub"
5. Complete GitHub OAuth
6. Should redirect to `/dashboard`

#### Expected Results:
- ✅ Login page displays with GitHub button
- ✅ OAuth flow completes without errors
- ✅ Profile automatically created in database
- ✅ Dashboard loads successfully
- ✅ User data displays correctly

#### Verification:
```sql
-- Check profile was created
SELECT * FROM profiles WHERE id = '<your-user-id>';
```

---

### Test 2: Task Creation & Completion

#### Steps:
1. On dashboard, enter task title: "Write documentation"
2. Select category: "Writing" (10 XP)
3. Click "Create Task"
4. Verify task appears in pending list
5. Click "Complete" button
6. Check XP awarded message

#### Expected Results:
- ✅ Task created successfully
- ✅ Task appears in list with correct category emoji
- ✅ Completing task awards 10 XP
- ✅ Profile total_xp increases by 10
- ✅ writing_xp increases by 10
- ✅ Level card updates
- ✅ Today's XP summary updates
- ✅ Streak increments to 1 (first task of the day)
- ✅ Task moves to "Completed Today" section

#### Verification:
```sql
-- Check task
SELECT * FROM tasks WHERE user_id = '<your-user-id>';

-- Check XP log
SELECT * FROM xp_logs WHERE user_id = '<your-user-id>';

-- Check profile updates
SELECT total_xp, writing_xp, current_streak, last_active_date
FROM profiles WHERE id = '<your-user-id>';
```

---

### Test 3: Daily XP Cap (100 XP)

#### Steps:
1. Create and complete 7 "Coding" tasks (7 × 15 = 105 XP)
2. Watch XP accumulation

#### Expected Results:
- ✅ First 6 tasks award full XP (6 × 15 = 90 XP)
- ✅ 7th task awards only 10 XP (to reach 100 cap)
- ✅ Alert shows: "Partial XP awarded: 10/15 XP (daily cap limit)"
- ✅ Today's XP summary shows 100/100 XP
- ✅ Further tasks complete but award 0 XP
- ✅ Alert shows: "Daily XP cap reached (100 XP). Task completed but no XP awarded."

#### Verification:
```sql
-- Check today's total
SELECT SUM(xp_amount) as today_total
FROM xp_logs
WHERE user_id = '<your-user-id>'
  AND created_at >= CURRENT_DATE;

-- Should return 100
```

---

### Test 4: GitHub Sync

#### Steps:
1. Make 3 commits to any public GitHub repo
2. On dashboard, click "Sync GitHub Commits"
3. Wait for sync to complete

#### Expected Results:
- ✅ Sync succeeds
- ✅ Shows "Synced 3 commits, earned 15 XP!"
- ✅ Profile github_xp increases by 15
- ✅ Total XP increases by 15
- ✅ Today's XP summary updates
- ✅ Category breakdown shows GitHub XP

#### Expected Results (if no commits):
- ✅ Shows "No new commits found today."
- ✅ No XP awarded

#### Verification:
```sql
-- Check GitHub sync log
SELECT * FROM github_sync_logs
WHERE user_id = '<your-user-id>'
  AND sync_date = CURRENT_DATE;

-- Check GitHub XP
SELECT github_xp FROM profiles WHERE id = '<your-user-id>';
```

---

### Test 5: GitHub XP Priority & Daily Caps

#### Scenario: Test that GitHub XP (max 30) is calculated first, then Task XP uses remaining cap

#### Steps:
1. Fresh day (reset test or next day)
2. Make 10+ commits (to hit GitHub max)
3. Sync GitHub → should get 30 XP
4. Create and complete 5 "Coding" tasks (5 × 15 = 75 XP)
5. Total should be 30 + 70 = 100 XP (capped)

#### Expected Results:
- ✅ GitHub sync awards 30 XP (max GitHub daily)
- ✅ Shows "(GitHub daily max reached: 30 XP)"
- ✅ First 4 Coding tasks award full 15 XP each (60 XP)
- ✅ 5th Coding task awards only 10 XP (to reach 100 total)
- ✅ Total for day: 100 XP

#### Verification:
```sql
-- Check breakdown
SELECT
  github_xp,
  coding_xp,
  total_xp
FROM profiles
WHERE id = '<your-user-id>';

-- Check today's total
SELECT
  source_type,
  category,
  SUM(xp_amount) as xp
FROM xp_logs
WHERE user_id = '<your-user-id>'
  AND created_at >= CURRENT_DATE
GROUP BY source_type, category;
```

---

### Test 6: Streak System

#### Day 1:
1. Complete 1 task
2. Check streak = 1

#### Day 2 (next consecutive day):
1. Complete 1 task
2. Check streak = 2
3. Check longest_streak = 2

#### Day 4 (skip Day 3):
1. Complete 1 task
2. Check streak = 1 (reset due to gap)
3. Check longest_streak = 2 (preserved)

#### Expected Results:
- ✅ Consecutive days increment streak
- ✅ Gaps reset streak to 1
- ✅ longest_streak never decreases
- ✅ GitHub sync does NOT affect streak
- ✅ Only Task completion updates streak
- ✅ Multiple tasks in same day don't multiply streak

#### Verification:
```sql
-- Check streak
SELECT current_streak, longest_streak, last_active_date
FROM profiles WHERE id = '<your-user-id>';
```

---

### Test 7: Level Progression

#### Steps:
1. Check current level (should be 1)
2. Accumulate 100 XP
3. Check level increases to 2
4. Accumulate to 282 total XP
5. Check level increases to 3

#### Expected Results:
- ✅ Level 1 → 2 at 100 XP
- ✅ Level 2 → 3 at 282 XP
- ✅ Level 3 → 4 at 519 XP
- ✅ Progress bar shows correct percentage
- ✅ "XP Progress" shows correct values

#### Level Formula Verification:
```javascript
// Formula: nextLevelXp = 100 * (level ^ 1.5)
Level 1 → 2: 100 XP
Level 2 → 3: 282 XP (cumulative)
Level 3 → 4: 519 XP (cumulative)
```

---

### Test 8: Category Breakdown

#### Steps:
1. Complete 1 task from each category:
   - Coding: 15 XP
   - Learning: 12 XP
   - Writing: 10 XP
   - Health: 8 XP
2. Sync GitHub: 5 XP (1 commit)
3. Check category breakdown display

#### Expected Results:
- ✅ Each category shows correct XP amount
- ✅ Progress bars show correct proportions
- ✅ Total: 50 XP
- ✅ Percentages add up to 100%

---

### Test 9: Task Deletion

#### Steps:
1. Create a task
2. Click delete (×) button
3. Confirm deletion

#### Expected Results:
- ✅ Task removed from list
- ✅ No XP awarded for deleted pending tasks
- ✅ Deleted tasks don't appear in any lists

#### Verification:
```sql
-- Check task status
SELECT id, title, status
FROM tasks
WHERE user_id = '<your-user-id>'
  AND status = 'deleted';
```

---

### Test 10: Multiple Category Tasks

#### Steps:
1. Create 2 Coding tasks
2. Create 1 Learning task
3. Create 1 Health task
4. Complete all 4
5. Check XP breakdown

#### Expected Results:
- ✅ Coding: 30 XP (2 × 15)
- ✅ Learning: 12 XP
- ✅ Health: 8 XP
- ✅ Total: 50 XP
- ✅ All categories display in breakdown

---

## Security Testing

### Test 11: RLS Policy Verification

#### Steps:
1. Create test user A
2. Create test user B
3. User A creates tasks
4. Try to query User A's tasks as User B

#### Expected Results:
- ✅ User B cannot see User A's tasks
- ✅ User B cannot complete User A's tasks
- ✅ User B cannot modify User A's profile
- ✅ User B cannot see User A's XP logs

#### Manual Testing:
```javascript
// In browser console as User B:
const supabase = createClient();
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('user_id', '<user-a-id>');

// Should return empty array or error
```

---

### Test 12: XP Manipulation Prevention

#### Steps:
1. Try to directly insert XP via browser console

```javascript
const { error } = await supabase
  .from('xp_logs')
  .insert({
    user_id: '<your-id>',
    source_type: 'task',
    category: 'coding',
    xp_amount: 9999,
    daily_total: 9999
  });
```

#### Expected Results:
- ✅ Insert fails (RLS blocks it)
- ✅ Only server functions can insert XP
- ✅ XP logs table is read-only for clients

---

## Performance Testing

### Test 13: Load Times

#### Metrics:
- [ ] Initial page load < 2 seconds
- [ ] Dashboard render < 1 second
- [ ] Task operations < 500ms
- [ ] GitHub sync < 3 seconds (depends on API)

#### Tools:
- Chrome DevTools Network tab
- Lighthouse performance audit

---

## Edge Cases

### Test 14: Timezone Consistency (KST)

#### Steps:
1. Test from different timezones
2. Verify all "today" calculations use KST
3. Check streak continuity across timezones

#### Expected Results:
- ✅ All dates in KST (UTC+9)
- ✅ Daily cap resets at midnight KST
- ✅ Streak logic uses KST dates

---

### Test 15: Concurrent Operations

#### Steps:
1. Complete multiple tasks rapidly
2. Sync GitHub while completing tasks
3. Check final XP totals are accurate

#### Expected Results:
- ✅ No race conditions
- ✅ XP totals are correct
- ✅ No duplicate XP logs

---

## Success Criteria

All tests must pass with these metrics:

- [x] **Authentication**: GitHub OAuth works end-to-end
- [x] **Task CRUD**: Create, complete, delete all work
- [x] **XP System**: Daily cap (100), category XP, GitHub priority all correct
- [x] **Streak**: Consecutive days increment, gaps reset
- [x] **Level**: Formula works, progress bar accurate
- [x] **Security**: RLS prevents unauthorized access, XP manipulation blocked
- [x] **Performance**: Page loads < 2s, operations < 500ms
- [x] **UI**: All components render, responsive on mobile

---

## Known Limitations (MVP)

1. **Timezone**: Fixed to KST (UTC+9)
   - Future: Add user-configurable timezone

2. **GitHub**: Public repos only
   - Future: Add GitHub PAT for private repos

3. **XP Source**: Tasks + commits only
   - Future: Add PRs, reviews, issues

4. **No Undo**: Completed tasks can't be reverted
   - Future: Add undo feature with time limit

---

## Next Steps After MVP Validation

1. Deploy to production (Vercel)
2. Monitor user behavior
3. Gather feedback
4. Plan Phase 2 features (see plan.md)

---

## Troubleshooting

### Profile not created after signup
```sql
-- Manually create profile
INSERT INTO profiles (id, username)
VALUES ('<user-id>', 'username');
```

### Tasks not loading
- Check RLS policies enabled
- Verify user is authenticated
- Check browser console for errors

### XP not updating
- Check database function exists
- Verify no errors in server logs
- Check xp_logs table for entries

### GitHub sync fails
- Verify GitHub username set in profile
- Check username is correct (case-sensitive)
- Ensure commits are in public repos
- Check GitHub API rate limits

---

## Database Cleanup (for testing)

```sql
-- Reset user data (BE CAREFUL!)
DELETE FROM xp_logs WHERE user_id = '<your-id>';
DELETE FROM tasks WHERE user_id = '<your-id>';
DELETE FROM github_sync_logs WHERE user_id = '<your-id>';

UPDATE profiles
SET
  total_xp = 0,
  level = 1,
  coding_xp = 0,
  learning_xp = 0,
  writing_xp = 0,
  health_xp = 0,
  github_xp = 0,
  current_streak = 0,
  longest_streak = 0,
  last_active_date = NULL
WHERE id = '<your-id>';
```
