import { POSTS } from "../data/posts.js";
import { summary } from "../format/post.js";
import { paginate } from "../lib/paginate.js";
import { newestFirst } from "../lib/sort.js";
import { parseListQuery } from "./query.js";

/** GET /posts?page=&size=&tag= */
export function listPosts(query, posts = POSTS) {
  const { page, size, tag } = parseListQuery(query);
  const matching = tag ? posts.filter((p) => p.tag === tag) : posts;
  const result = paginate(newestFirst(matching), page, size);
  return { ...result, items: result.items.map(summary) };
}

/** GET /posts/:id */
export function getPost(id, posts = POSTS) {
  return posts.find((p) => p.id === Number(id)) ?? null;
}
