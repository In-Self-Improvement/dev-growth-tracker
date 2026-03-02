'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { syncGitHubCommits, updateGitHubUsername } from '@/actions/github';

/**
 * Hook to sync GitHub commits and award XP
 */
export function useGitHubSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncGitHubCommits,
    onSuccess: () => {
      // Invalidate profile to refetch updated XP
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.github.syncLogs });
    },
  });
}

/**
 * Hook to update GitHub username
 */
export function useUpdateGitHubUsername() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => updateGitHubUsername(username),
    onSuccess: () => {
      // Invalidate profile to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}
