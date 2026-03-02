'use client';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Streak</h2>

      <div className="flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="text-5xl mb-2">🔥</div>
          <div className="text-4xl font-bold text-orange-600">
            {currentStreak}
          </div>
          <div className="text-sm text-gray-600 mt-1">days</div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Longest Streak</span>
          <span className="font-semibold text-gray-900">{longestStreak} days</span>
        </div>
      </div>

      {currentStreak === 0 && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          Complete a task today to start your streak!
        </div>
      )}
    </div>
  );
}
