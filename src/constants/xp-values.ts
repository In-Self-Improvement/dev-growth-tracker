/**
 * XP System Constants
 *
 * Defines XP values for different task categories and daily caps
 */

export const XP_VALUES = {
  coding: 15,
  learning: 12,
  writing: 10,
  health: 8,
  github_commit: 5,
} as const;

export const DAILY_CAPS = {
  total: 100,
  github_max: 30,
} as const;

export type TaskCategory = 'coding' | 'learning' | 'writing' | 'health';

export const TASK_CATEGORIES: Record<TaskCategory, { label: string; xp: number; emoji: string }> = {
  coding: {
    label: 'Coding',
    xp: XP_VALUES.coding,
    emoji: '💻',
  },
  learning: {
    label: 'Learning',
    xp: XP_VALUES.learning,
    emoji: '📚',
  },
  writing: {
    label: 'Writing',
    xp: XP_VALUES.writing,
    emoji: '✍️',
  },
  health: {
    label: 'Health',
    xp: XP_VALUES.health,
    emoji: '💪',
  },
};
