'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getTasks, createTask, completeTask, deleteTask } from '@/actions/tasks';
import type { TaskCategory } from '@/constants/xp-values';

/**
 * Hook to fetch tasks
 */
export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.all,
    queryFn: getTasks,
    staleTime: 30000, // 30 seconds
  });
}

/**
 * Hook to create a new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, category }: { title: string; category: TaskCategory }) =>
      createTask(title, category),
    onSuccess: () => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

/**
 * Hook to complete a task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => completeTask(taskId),
    onSuccess: () => {
      // Invalidate both tasks and profile queries
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

/**
 * Hook to delete a task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}
