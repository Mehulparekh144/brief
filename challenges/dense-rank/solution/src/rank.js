const byName = (a, b) => {
  const x = a.name.toLowerCase();
  const y = b.name.toLowerCase();
  return x < y ? -1 : x > y ? 1 : 0;
};

/** Leaderboard rows, best first, with dense ranks. */
export function rank(players) {
  let r = 0;
  let prev;
  return [...players]
    .sort((a, b) => b.score - a.score || byName(a, b))
    .map((p) => {
      if (r === 0 || p.score !== prev) r++;
      prev = p.score;
      return { rank: r, name: p.name, score: p.score };
    });
}
