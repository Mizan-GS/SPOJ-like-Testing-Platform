// utils/leaderboard.js
export function buildWeeklyLeaderboard(attempts) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  // 1️⃣ Filter last 7 days
  const weeklyAttempts = attempts.filter(a => {
    return new Date(a.endTime).getTime() >= oneWeekAgo;
  });

  // 2️⃣ Pick best attempt per user
  const bestByUser = {};

  weeklyAttempts.forEach(attempt => {
    const userId = attempt.user.email; // stable key
    const duration =
      new Date(attempt.endTime) - new Date(attempt.startTime);

    if (!bestByUser[userId]) {
      bestByUser[userId] = { ...attempt, duration };
      return;
    }

    const existing = bestByUser[userId];

    // higher score wins
    if (attempt.score > existing.score) {
      bestByUser[userId] = { ...attempt, duration };
      return;
    }

    // tie → faster wins
    if (
      attempt.score === existing.score &&
      duration < existing.duration
    ) {
      bestByUser[userId] = { ...attempt, duration };
    }
  });

  // 3️⃣ Convert to array & sort
  return Object.values(bestByUser).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.duration - b.duration;
  });
}
