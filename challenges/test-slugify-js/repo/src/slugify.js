const MAX_LENGTH = 40;

/** Turns a post title into a URL slug: "Crème Brûlée!" → "creme-brulee". */
export function slugify(title) {
  const slug = title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.slice(0, MAX_LENGTH).replace(/-+$/, "");
}
