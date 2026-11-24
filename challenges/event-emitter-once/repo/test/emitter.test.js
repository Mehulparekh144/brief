import assert from "node:assert/strict";
import { test } from "node:test";
import { Emitter } from "../src/events/emitter.js";

test("a once() listener does not stop the next listener", () => {
  const bus = new Emitter();
  const calls = [];
  bus.once("x", () => calls.push("once"));
  bus.on("x", () => calls.push("on"));
  bus.emit("x");
  assert.deepEqual(calls, ["once", "on"]);
});

test("on() listeners run in the order they were added", () => {
  const bus = new Emitter();
  const calls = [];
  bus.on("x", (v) => calls.push(`a${v}`));
  bus.on("x", (v) => calls.push(`b${v}`));
  bus.emit("x", 1);
  assert.deepEqual(calls, ["a1", "b1"]);
});
