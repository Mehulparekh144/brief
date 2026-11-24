/** The short form of a post used in lists. */
export const summary = (post) => ({
  id: post.id,
  title: post.title,
  author: post.author,
  date: post.publishedAt.slice(0, 10),
});
