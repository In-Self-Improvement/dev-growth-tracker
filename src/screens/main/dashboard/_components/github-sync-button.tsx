'use client';

import { useState } from 'react';
import { useGitHubSync } from '../_hooks/use-github-sync';
import { Button } from '@/components/ui/button';

export function GitHubSyncButton() {
  const githubSync = useGitHubSync();
  const [lastSyncMessage, setLastSyncMessage] = useState<string>('');

  const handleSync = async () => {
    try {
      const result = await githubSync.mutateAsync();

      let message = `Synced ${result.commitCount} commits, earned ${result.xpAwarded} XP!`;

      if (result.githubMaxReached) {
        message += ' (GitHub daily max reached: 30 XP)';
      }

      if (result.dailyCapReached) {
        message += ' (Daily cap reached: 100 XP)';
      }

      if (result.commitCount === 0) {
        message = 'No new commits found today.';
      }

      setLastSyncMessage(message);
    } catch (error) {
      console.error('Failed to sync GitHub:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync';
      setLastSyncMessage(`Error: ${errorMessage}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        GitHub Integration
      </h3>

      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Sync your GitHub commits to earn XP (5 XP per commit, max 30 XP/day)
        </p>

        <Button
          onClick={handleSync}
          disabled={githubSync.isPending}
          className="w-full"
          variant="outline"
        >
          <span className="mr-2">🐙</span>
          {githubSync.isPending ? 'Syncing...' : 'Sync GitHub Commits'}
        </Button>

        {lastSyncMessage && (
          <div
            className={`text-sm p-3 rounded-md ${
              lastSyncMessage.startsWith('Error')
                ? 'bg-red-50 text-red-700'
                : 'bg-green-50 text-green-700'
            }`}
          >
            {lastSyncMessage}
          </div>
        )}
      </div>
    </div>
  );
}
