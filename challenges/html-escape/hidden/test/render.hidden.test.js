import assert from "node:assert/strict";
import { test } from "node:test";
import { renderPost } from "../src/pages/post.js";
import { renderSearch } from "../src/pages/search.js";
import { render } from "../src/template/render.js";

test("hidden: {{key}} escapes all five characters", () => {
  assert.equal(render("{{x}}", { x: `<b>"Tom" & 'Jerry'</b>` }), "&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;");
});
test("hidden: & is escaped once, before the rest", () => {
  assert.equal(render("{{x}}", { x: "&lt;" }), "&amp;lt;");
  assert.equal(render("{{x}}", { x: "a && b" }), "a &amp;&amp; b");
});
test("hidden: {{{key}}} is raw only for allowed keys", () => {
  assert.equal(render("<div>{{{html}}}</div>", { html: "<em>hi</em>" }, { allowRaw: ["html"] }), "<div><em>hi</em></div>");
  assert.equal(render("<div>{{{html}}}</div>", { html: "<em>hi</em>" }, { allowRaw: ["other"] }), "<div>&lt;em&gt;hi&lt;/em&gt;</div>");
  assert.equal(render("<div>{{{html}}}</div>", { html: `<img src=x onerror="alert('x')">` }), "<div>&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;</div>");
});
test("hidden: missing values render empty, 0 renders as 0", () => {
  assert.equal(render("[{{a}}][{{{b}}}][{{c}}][{{d}}]", { b: undefined, c: null, d: 0 }, { allowRaw: ["b"] }), "[][][][0]");
  assert.equal(render("{{flag}}", { flag: false }), "false");
});
test("hidden: inserted values are not scanned again", () => {
  assert.equal(render("<p>{{{body}}}</p>", { body: "{{secret}}", secret: "s3cr3t" }, { allowRaw: ["body"] }), "<p>{{secret}}</p>");
  assert.equal(render("{{{c}}} {{x}}", { c: "{{x}}", x: "y" }), "{{x}} y");
});
test("hidden: the search page escapes the query", () => {
  const html = renderSearch(`" autofocus onfocus="alert(document.cookie)`, []);
  assert.ok(html.includes('value="&quot; autofocus onfocus=&quot;alert(document.cookie)"'), html);
  assert.ok(html.includes("<title>Search: &quot; autofocus"), html);
  assert.ok(html.includes("<p>0 results</p><ul></ul>"), html);
});
test("hidden: search results are escaped inside the raw list", () => {
  const html = renderSearch("tom", [{ id: 7, title: "Tom & Jerry's <script>" }]);
  assert.ok(html.includes('<li><a href="/posts/7">Tom &amp; Jerry&#39;s &lt;script&gt;</a></li>'), html);
});
test("hidden: a post keeps its Markdown HTML but escapes title and comments", () => {
  const html = renderPost({
    title: `<img src=x onerror=alert(1)>`,
    author: "ana",
    body: "Tom & Jerry's **big** day",
    comments: [{ name: "eve", text: "<script>steal()</script>" }],
  });
  assert.ok(html.includes("<h1>&lt;img src=x onerror=alert(1)&gt;</h1>"), html);
  assert.ok(html.includes("<p>Tom &amp; Jerry&#39;s <strong>big</strong> day</p>"), html);
  assert.ok(html.includes("<li><b>eve</b>: &lt;script&gt;steal()&lt;/script&gt;</li>"), html);
  assert.ok(!html.includes("<script>"), html);
});
