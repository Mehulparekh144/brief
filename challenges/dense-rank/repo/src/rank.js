/** Leaderboard rows, best first. */
export function rank(players) {
  return players
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ rank: i + 1, name: p.name, score: p.score }));
}
