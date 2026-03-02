'use client';

import { DAILY_CAPS } from '@/constants/xp-values';

interface TodayXpSummaryProps {
  todayXp: number;
}

export function TodayXpSummary({ todayXp }: TodayXpSummaryProps) {
  const percentage = (todayXp / DAILY_CAPS.total) * 100;
  const remaining = Math.max(0, DAILY_CAPS.total - todayXp);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Today's Progress</h3>

      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-bold">{todayXp} XP</span>
          <span className="text-sm opacity-90">
            / {DAILY_CAPS.total} XP Daily Cap
          </span>
        </div>

        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percentage)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm opacity-90">
          <span>{remaining} XP remaining today</span>
          <span>{Math.round(percentage)}%</span>
        </div>

        {todayXp >= DAILY_CAPS.total && (
          <div className="mt-4 p-3 bg-white/10 rounded-md text-center text-sm font-medium">
            🎉 Daily cap reached! Great work!
          </div>
        )}
      </div>
    </div>
  );
}
