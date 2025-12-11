export const getStreakColor = (count) => {
  if (count >= 30) return 'text-purple-600 bg-purple-100';
  if (count >= 14) return 'text-blue-600 bg-blue-100';
  if (count >= 7) return 'text-green-600 bg-green-100';
  if (count >= 3) return 'text-yellow-600 bg-yellow-100';
  return 'text-gray-600 bg-gray-100';
};

export const getStreakEmoji = (count) => {
  if (count >= 30) return '👑';
  if (count >= 14) return '🔥';
  if (count >= 7) return '⭐';
  if (count >= 3) return '💪';
  return '🌱';
};