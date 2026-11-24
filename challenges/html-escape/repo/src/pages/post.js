import { markdown } from "../markdown.js";
import { render } from "../template/render.js";
import { page } from "./layout.js";

const POST = '<article><h1>{{title}}</h1><p class="by">by {{author}}</p>{{{bodyHtml}}}<ul class="comments">{{{comments}}}</ul></article>';
const COMMENT = "<li><b>{{name}}</b>: {{{text}}}</li>";

export function renderPost(post) {
  const comments = post.comments.map((c) => render(COMMENT, c)).join("");
  const data = { title: post.title, author: post.author, bodyHtml: markdown(post.body), comments };
  return page(post.title, render(POST, data, { allowRaw: ["bodyHtml", "comments"] }));
}
