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
      fn(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }

  off(event, fn) {
    const list = this.#listeners.get(event);
    if (!list) return this;
    const i = list.indexOf(fn);
    if (i !== -1) list.splice(i, 1);
    return this;
  }

  /** Calls the listeners in the order they were added. True if there was at least one. */
  emit(event, ...args) {
    const list = this.#listeners.get(event) ?? [];
    for (let i = 0; i < list.length; i++) list[i](...args);
    return list.length > 0;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.length ?? 0;
  }
}
