'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getProfile } from '@/actions/profile';

/**
 * Hook to fetch and manage user profile data
 */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const profile = await getProfile();
      return profile;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
