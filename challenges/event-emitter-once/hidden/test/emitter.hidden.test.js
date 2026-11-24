import assert from "node:assert/strict";
import { test } from "node:test";
import { Emitter } from "../src/events/emitter.js";
import { createPage } from "../src/index.js";

test("hidden: a listener that removes itself does not make the next one skip", () => {
  const bus = new Emitter();
  const calls = [];
  const a = () => {
    calls.push("a");
    bus.off("x", a);
  };
  bus.on("x", a);
  bus.on("x", () => calls.push("b"));
  bus.on("x", () => calls.push("c"));
  bus.emit("x");
  bus.emit("x");
  assert.deepEqual(calls, ["a", "b", "c", "b", "c"]);
});
test("hidden: a listener removed by an earlier one still runs this time", () => {
  const bus = new Emitter();
  const calls = [];
  const b = () => calls.push("b");
  bus.on("x", () => {
    calls.push("a");
    bus.off("x", b);
  });
  bus.on("x", b);
  bus.emit("x");
  bus.emit("x");
  assert.deepEqual(calls, ["a", "b", "a"]);
});
test("hidden: once() fires exactly once", () => {
  const bus = new Emitter();
  let n = 0;
  bus.once("x", () => n++);
  bus.emit("x");
  bus.emit("x");
  bus.emit("x");
  assert.equal(n, 1);
  assert.equal(bus.listenerCount("x"), 0);
});
test("hidden: once() fires once even when it emits the same event", () => {
  const bus = new Emitter();
  let n = 0;
  bus.once("x", () => {
    n++;
    bus.emit("x");
  });
  bus.emit("x");
  assert.equal(n, 1);
});
test("hidden: off() removes a once() listener before it fires", () => {
  const bus = new Emitter();
  let n = 0;
  const fn = () => n++;
  bus.once("x", fn);
  bus.off("x", fn);
  bus.emit("x");
  assert.equal(n, 0);
  assert.equal(bus.listenerCount("x"), 0);
});
test("hidden: once() passes every argument", () => {
  const bus = new Emitter();
  let got;
  bus.once("x", (...args) => {
    got = args;
  });
  bus.emit("x", 1, "two", { three: 3 });
  assert.deepEqual(got, [1, "two", { three: 3 }]);
});
test("hidden: the badge counts the first item, and analytics fires once", () => {
  const sent = [];
  const page = createPage({ send: (name, data) => sent.push([name, data]) });
  page.cart.add("MUG-01");
  assert.equal(page.badge.state.count, 1);
  page.cart.add("TEE-02");
  assert.equal(page.badge.state.count, 2);
  assert.deepEqual(sent, [["first_add", { sku: "MUG-01" }]]);
});
