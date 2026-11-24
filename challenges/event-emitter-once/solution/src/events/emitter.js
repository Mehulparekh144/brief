/** Small event emitter: on, once, off, emit. */
export class Emitter {
  #listeners = new Map();

  on(event, fn) {
    if (!this.#listeners.has(event)) this.#listeners.set(event, []);
    this.#listeners.get(event).push(fn);
    return this;
  }

  /** Like on(), but the listener runs only the first time. */
  once(event, fn) {
    const wrapper = (...args) => {
      this.off(event, wrapper); // first, so a re-emit inside fn does not call it again
      fn(...args);
    };
    wrapper.listener = fn;
    return this.on(event, wrapper);
  }

  /** Removes fn, also when it was added with once(). */
  off(event, fn) {
    const list = this.#listeners.get(event);
    if (!list) return this;
    const i = list.findIndex((l) => l === fn || l.listener === fn);
    if (i !== -1) list.splice(i, 1);
    return this;
  }

  /** Calls the listeners present when emit starts, in the order they were added. True if there was at least one. */
  emit(event, ...args) {
    const list = [...(this.#listeners.get(event) ?? [])];
    for (const fn of list) fn(...args);
    return list.length > 0;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0;
  }
}
