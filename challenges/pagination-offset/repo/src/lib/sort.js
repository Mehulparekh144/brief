/** Newest first. On a tie, the higher id comes first. */
export function newestFirst(posts) {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id - a.id);
}
