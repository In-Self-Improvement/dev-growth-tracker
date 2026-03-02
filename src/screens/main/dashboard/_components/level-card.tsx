'use client';

import { getLevelProgress } from '@/lib/xp/calculate-level';

interface LevelCardProps {
  level: number;
  totalXp: number;
}

export function LevelCard({ level, totalXp }: LevelCardProps) {
  const levelInfo = getLevelProgress(totalXp);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Level</h2>
        <div className="text-3xl font-bold text-purple-600">
          {levelInfo.currentLevel}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>XP Progress</span>
          <span>
            {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${levelInfo.progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>Level {levelInfo.currentLevel}</span>
          <span>Level {levelInfo.currentLevel + 1}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Total XP: <span className="font-semibold">{totalXp}</span>
        </div>
      </div>
    </div>
  );
}
