/**
 * Level Calculation Utilities
 *
 * Formula: nextLevelXp = 100 * (level ^ 1.5)
 */

/**
 * Calculate the XP required to reach the next level
 * @param level - Current level
 * @returns XP required for next level
 */
export function getXpForNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level + 1, 1.5));
}

/**
 * Calculate current level from total XP
 * @param totalXp - Total XP accumulated
 * @returns Current level
 */
export function calculateLevelFromXp(totalXp: number): number {
  let level = 1;
  let xpNeeded = 0;

  while (totalXp >= xpNeeded) {
    level++;
    xpNeeded = Math.floor(100 * Math.pow(level, 1.5));
  }

  return level - 1;
}

/**
 * Get XP progress for current level
 * @param totalXp - Total XP accumulated
 * @returns Object with level info and progress
 */
export function getLevelProgress(totalXp: number) {
  const currentLevel = calculateLevelFromXp(totalXp);
  const currentLevelXp = Math.floor(100 * Math.pow(currentLevel, 1.5));
  const nextLevelXp = getXpForNextLevel(currentLevel);
  const xpInCurrentLevel = totalXp - currentLevelXp;
  const xpNeededForNextLevel = nextLevelXp - currentLevelXp;
  const progressPercentage = (xpInCurrentLevel / xpNeededForNextLevel) * 100;

  return {
    currentLevel,
    totalXp,
    currentLevelXp,
    nextLevelXp,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
  };
}

/**
 * Get level milestones (for display purposes)
 * @param maxLevel - Maximum level to calculate
 * @returns Array of level milestones
 */
export function getLevelMilestones(maxLevel: number = 10) {
  const milestones = [];

  for (let level = 1; level <= maxLevel; level++) {
    milestones.push({
      level,
      xpRequired: Math.floor(100 * Math.pow(level, 1.5)),
    });
  }

  return milestones;
}
