'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { XP_VALUES, type TaskCategory } from '@/constants/xp-values';

/**
 * Get all tasks for the current user
 */
export async function getTasks() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return data;
}

/**
 * Create a new task
 */
export async function createTask(title: string, category: TaskCategory) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Validate inputs
  if (!title || title.trim().length === 0) {
    throw new Error('Task title is required');
  }

  if (title.length > 200) {
    throw new Error('Task title must be 200 characters or less');
  }

  if (!['coding', 'learning', 'writing', 'health'].includes(category)) {
    throw new Error('Invalid task category');
  }

  // Get XP reward for category
  const xpReward = XP_VALUES[category];

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: user.id,
      title: title.trim(),
      category,
      xp_reward: xpReward,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  revalidatePath('/dashboard');

  return data;
}

/**
 * Complete a task and award XP
 */
export async function completeTask(taskId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Call the database function to complete task and award XP
  const { data, error } = await supabase.rpc('complete_task_with_xp', {
    p_task_id: taskId,
    p_user_id: user.id,
  });

  if (error || !data) {
    throw new Error(`Failed to complete task: ${error?.message || 'No data returned'}`);
  }

  // Type assertion for the response
  const result = data as {
    success: boolean;
    xp_awarded: number;
    requested_xp: number;
    daily_cap_reached: boolean;
    today_total: number;
  };

  revalidatePath('/dashboard');

  return result;
}

/**
 * Delete a task (soft delete)
 */
export async function deleteTask(taskId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('tasks')
    .update({ status: 'deleted' })
    .eq('id', taskId)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(`Failed to delete task: ${error.message}`);
  }

  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Get today's total XP for the current user
 */
export async function getTodayXpTotal() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.rpc('get_today_xp_total', {
    p_user_id: user.id,
  });

  if (error) {
    throw new Error(`Failed to get today's XP: ${error.message}`);
  }

  return data as number;
}
