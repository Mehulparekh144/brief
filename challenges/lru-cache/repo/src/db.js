const PROFILES = new Map([
  [1, { id: 1, name: "Ada", plan: "pro" }],
  [2, { id: 2, name: "Grace", plan: "free" }],
  [3, { id: 3, name: "Linus", plan: "free" }],
]);

export let reads = 0;

export async function findProfile(id) {
  reads++;
  return PROFILES.get(id) ?? null;
}
