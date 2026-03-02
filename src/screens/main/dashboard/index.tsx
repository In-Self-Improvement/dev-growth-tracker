'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useProfile } from './_hooks/use-profile';
import { LevelCard } from './_components/level-card';
import { StreakDisplay } from './_components/streak-display';
import { TodayXpSummary } from './_components/today-xp-summary';
import { CategoryBreakdown } from './_components/category-breakdown';
import { AddTaskForm } from './_components/add-task-form';
import { GitHubSyncButton } from './_components/github-sync-button';
import { TaskList } from './_components/task-list';
import { getTodayXpTotal } from '@/actions/tasks';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';

export function DashboardScreen() {
  const router = useRouter();
  const supabase = createClient();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: todayXp = 0 } = useQuery({
    queryKey: queryKeys.xpLogs.today,
    queryFn: getTodayXpTotal,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Dev Growth Tracker
          </h1>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Level and Streak */}
          <div className="grid md:grid-cols-2 gap-6">
            <LevelCard level={profile.level} totalXp={profile.total_xp} />
            <StreakDisplay
              currentStreak={profile.current_streak}
              longestStreak={profile.longest_streak}
            />
          </div>

          {/* Today's XP */}
          <TodayXpSummary todayXp={todayXp} />

          {/* Category Breakdown */}
          <CategoryBreakdown
            codingXp={profile.coding_xp}
            learningXp={profile.learning_xp}
            writingXp={profile.writing_xp}
            healthXp={profile.health_xp}
            githubXp={profile.github_xp}
          />

          {/* Task Management */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <AddTaskForm />
              <GitHubSyncButton />
            </div>
            <div>
              <TaskList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
