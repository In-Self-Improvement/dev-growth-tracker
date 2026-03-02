'use client';

import { useTasks } from '../_hooks/use-tasks';
import { TaskItem } from './task-item';

export function TaskList() {
  const { data: tasks, isLoading, error } = useTasks();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          Failed to load tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  const pendingTasks = tasks?.filter((t) => t.status === 'pending') || [];
  const completedTasks = tasks?.filter((t) => t.status === 'completed') || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tasks ({pendingTasks.length} pending)
      </h3>

      {tasks && tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Create your first task to get started!
        </div>
      )}

      <div className="space-y-3">
        {pendingTasks.length > 0 && (
          <div className="space-y-2">
            {pendingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Completed Today ({completedTasks.length})
            </h4>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
