import { render } from "../template/render.js";
import { page } from "./layout.js";

const SEARCH = '<form action="/search"><input name="q" value="{{q}}"></form><p>{{count}} results</p><ul>{{{list}}}</ul>';
const RESULT = '<li><a href="/posts/{{id}}">{{title}}</a></li>';

/** GET /search?q= */
export function renderSearch(q, results) {
  const list = results.map((r) => render(RESULT, r)).join("");
  return page(`Search: ${q}`, render(SEARCH, { q, count: results.length, list }, { allowRaw: ["list"] }));
}
