'use client';

import { useState } from 'react';
import { useCreateTask } from '../_hooks/use-tasks';
import { TASK_CATEGORIES, type TaskCategory } from '@/constants/xp-values';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('coding');
  const createTask = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      await createTask.mutateAsync({ title: title.trim(), category });
      setTitle('');
      setCategory('coding');
    } catch (error) {
      console.error('Failed to create task:', error);
      alert(error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <Input
            id="task-title"
            type="text"
            placeholder="What do you want to accomplish?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            disabled={createTask.isPending}
          />
        </div>

        <div>
          <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="task-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as TaskCategory)}
            disabled={createTask.isPending}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {Object.entries(TASK_CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.emoji} {cat.label} ({cat.xp} XP)
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={!title.trim() || createTask.isPending}
          className="w-full"
        >
          {createTask.isPending ? 'Creating...' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}
