import { findProfile } from "./db.js";
import { LRUCache } from "./lru.js";

const cache = new LRUCache(100);

export async function getUser(id) {
  if (cache.has(id)) return cache.get(id);
  const profile = await findProfile(id);
  if (profile) cache.set(id, profile);
  return profile;
}
