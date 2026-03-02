'use client';

import { TASK_CATEGORIES } from '@/constants/xp-values';
import { useCompleteTask, useDeleteTask } from '../_hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    category: 'coding' | 'learning' | 'writing' | 'health';
    status: 'pending' | 'completed' | 'deleted';
    xp_reward: number;
    completed_at: string | null;
    created_at: string;
  };
}

export function TaskItem({ task }: TaskItemProps) {
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const handleComplete = async () => {
    if (task.status === 'completed') return;

    try {
      const result = await completeTask.mutateAsync(task.id);

      if (result.daily_cap_reached && result.xp_awarded === 0) {
        alert('Daily XP cap reached (100 XP). Task completed but no XP awarded.');
      } else if (result.xp_awarded < result.requested_xp) {
        alert(`Partial XP awarded: ${result.xp_awarded}/${result.requested_xp} XP (daily cap limit)`);
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete task');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await deleteTask.mutateAsync(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const category = TASK_CATEGORIES[task.category];
  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${
        isCompleted
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-purple-300'
      } transition-colors`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="text-2xl flex-shrink-0">{category.emoji}</div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium ${
              isCompleted
                ? 'text-gray-500 line-through'
                : 'text-gray-900'
            } truncate`}
          >
            {task.title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {category.label}
            </Badge>
            <span className="text-xs text-gray-500">
              {task.xp_reward} XP
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {!isCompleted && (
          <Button
            size="sm"
            onClick={handleComplete}
            disabled={completeTask.isPending}
          >
            {completeTask.isPending ? '...' : 'Complete'}
          </Button>
        )}
        {isCompleted && (
          <Badge variant="default" className="bg-green-600">
            ✓ Done
          </Badge>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={handleDelete}
          disabled={deleteTask.isPending}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {deleteTask.isPending ? '...' : '×'}
        </Button>
      </div>
    </div>
  );
}
