'use client';

import { TASK_CATEGORIES } from '@/constants/xp-values';

interface CategoryBreakdownProps {
  codingXp: number;
  learningXp: number;
  writingXp: number;
  healthXp: number;
  githubXp: number;
}

export function CategoryBreakdown({
  codingXp,
  learningXp,
  writingXp,
  healthXp,
  githubXp,
}: CategoryBreakdownProps) {
  const totalXp = codingXp + learningXp + writingXp + healthXp + githubXp;

  const categories = [
    { label: 'Coding', emoji: '💻', xp: codingXp, color: 'bg-blue-500' },
    { label: 'Learning', emoji: '📚', xp: learningXp, color: 'bg-green-500' },
    { label: 'Writing', emoji: '✍️', xp: writingXp, color: 'bg-yellow-500' },
    { label: 'Health', emoji: '💪', xp: healthXp, color: 'bg-red-500' },
    { label: 'GitHub', emoji: '🐙', xp: githubXp, color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        XP Breakdown
      </h2>

      <div className="space-y-3">
        {categories.map((category) => {
          const percentage = totalXp > 0 ? (category.xp / totalXp) * 100 : 0;

          return (
            <div key={category.label}>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <span>{category.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {category.xp} XP
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`${category.color} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {totalXp === 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Complete tasks to earn XP!
        </div>
      )}
    </div>
  );
}
