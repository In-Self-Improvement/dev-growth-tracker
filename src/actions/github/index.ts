'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface GitHubEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: Array<{ sha: string }>;
  };
}

/**
 * Sync GitHub commits and award XP
 */
export async function syncGitHubCommits() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get GitHub username from profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('github_username')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new Error('Failed to get user profile');
  }

  const githubUsername = profile.github_username || user.user_metadata?.user_name;

  if (!githubUsername) {
    throw new Error('GitHub username not found. Please update your profile.');
  }

  try {
    // Get today's date in KST
    const now = new Date();
    const kstDate = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const todayStart = new Date(kstDate.getFullYear(), kstDate.getMonth(), kstDate.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Fetch GitHub events
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/events/public`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'dev-growth-tracker',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const events: GitHubEvent[] = await response.json();

    // Filter for today's push events
    const todayCommits = events
      .filter((event) => {
        if (event.type !== 'PushEvent') return false;
        const eventDate = new Date(event.created_at);
        return eventDate >= todayStart && eventDate < todayEnd;
      })
      .reduce((count, event) => {
        const commits = event.payload?.commits?.length || 0;
        return count + commits;
      }, 0);

    // Award XP via database function
    const { data, error } = await supabase.rpc('award_github_xp', {
      p_user_id: user.id,
      p_commit_count: todayCommits,
    });

    if (error || !data) {
      throw new Error(`Failed to award GitHub XP: ${error?.message || 'No data returned'}`);
    }

    // Type assertion for the response
    const result = data as {
      success: boolean;
      xp_awarded: number;
      commit_count: number;
      daily_cap_reached: boolean;
      github_max_reached: boolean;
      today_total: number;
    };

    revalidatePath('/dashboard');

    return {
      success: true,
      commitCount: todayCommits,
      xpAwarded: result.xp_awarded,
      dailyCapReached: result.daily_cap_reached,
      githubMaxReached: result.github_max_reached,
      todayTotal: result.today_total,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to sync GitHub commits');
  }
}

/**
 * Update GitHub username in profile
 */
export async function updateGitHubUsername(username: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!username || username.trim().length === 0) {
    throw new Error('GitHub username is required');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ github_username: username.trim() })
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update GitHub username: ${error.message}`);
  }

  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Get today's GitHub XP
 */
export async function getTodayGitHubXp() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.rpc('get_today_github_xp', {
    p_user_id: user.id,
  });

  if (error) {
    throw new Error(`Failed to get today's GitHub XP: ${error.message}`);
  }

  return data as number;
}
