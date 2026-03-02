'use server';

import { createClient } from '@/lib/supabase/server';
import { getLevelProgress } from '@/lib/xp/calculate-level';

/**
 * Get current user's profile with level information
 */
export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }

  // Calculate level progress
  const levelInfo = getLevelProgress(profile.total_xp);

  return {
    ...profile,
    levelInfo,
  };
}

/**
 * Update user's profile
 */
export async function updateProfile(updates: {
  username?: string;
  github_username?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Validate username if provided
  if (updates.username !== undefined) {
    if (updates.username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
  }

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return { success: true };
}
