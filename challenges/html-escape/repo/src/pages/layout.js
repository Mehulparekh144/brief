import { render } from "../template/render.js";

const LAYOUT = "<!doctype html><html><head><title>{{title}}</title></head><body>{{{content}}}</body></html>";

/** Wraps rendered HTML in the site layout. */
export const page = (title, content) => render(LAYOUT, { title, content }, { allowRaw: ["content"] });
