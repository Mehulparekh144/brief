/** [{ player: "Ann", points: 3 }, ...] -> [{ name: "Ann", score: 7 }, ...] */
export function totals(results) {
  const byName = new Map();
  for (const r of results) byName.set(r.player, (byName.get(r.player) ?? 0) + r.points);
  return [...byName].map(([name, score]) => ({ name, score }));
}
