import { slugify } from "./slugify.js";

/** The public URL of a post: /blog/<year>/<slug>. */
export const postUrl = (post) => `/blog/${post.date.slice(0, 4)}/${slugify(post.title)}`;
