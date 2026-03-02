/**
 * React Query Keys
 *
 * Centralized query key definitions for React Query
 */

export const queryKeys = {
  // Profile queries
  profile: ['profile'] as const,

  // Task queries
  tasks: {
    all: ['tasks'] as const,
    list: (status?: string) => ['tasks', 'list', { status }] as const,
    detail: (id: string) => ['tasks', 'detail', id] as const,
  },

  // XP logs queries
  xpLogs: {
    all: ['xp-logs'] as const,
    today: ['xp-logs', 'today'] as const,
  },

  // GitHub sync queries
  github: {
    syncLogs: ['github', 'sync-logs'] as const,
    todayXp: ['github', 'today-xp'] as const,
  },
} as const;
