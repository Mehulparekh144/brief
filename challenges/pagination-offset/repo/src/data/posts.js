const TAGS = ["news", "howto", "release"];

/** 23 sample posts, one per day in January 2026. */
export const POSTS = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}`,
  author: i % 4 === 0 ? "ana" : "ben",
  tag: TAGS[i % 3],
  publishedAt: `2026-01-${String(i + 1).padStart(2, "0")}T09:00:00Z`,
}));
