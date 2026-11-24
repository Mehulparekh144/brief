import assert from "node:assert/strict";
import { test } from "node:test";
import { render } from "../src/template/render.js";

test("{{key}} escapes double quotes", () => {
  assert.equal(render('<input value="{{q}}">', { q: '" onfocus="alert(1)' }), '<input value="&quot; onfocus=&quot;alert(1)">');
});

test("{{key}} escapes < and >", () => {
  assert.equal(render("<p>{{x}}</p>", { x: "<b>" }), "<p>&lt;b&gt;</p>");
});
