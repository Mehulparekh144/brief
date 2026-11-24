/** A cache that holds at most `capacity` keys and evicts the least recently used one. */
export class LRUCache {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity < 1) throw new RangeError("capacity must be an integer of at least 1");
    this.capacity = capacity;
    this.map = new Map(); // insertion order = use order, oldest first
  }

  get size() {
    return this.map.size;
  }

  get(key) {
    if (!this.map.has(key)) return undefined;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    else if (this.map.size >= this.capacity) this.map.delete(this.map.keys().next().value);
    this.map.set(key, value);
    return this;
  }

  has(key) {
    return this.map.has(key);
  }
}
