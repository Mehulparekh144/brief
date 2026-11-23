const PRODUCTS = [
  { sku: "MUG-01", name: "Coffee mug", price: 12.5, weightKg: 0.4 },
  { sku: "TEE-02", name: "T-shirt", price: 22, weightKg: 0.2 },
  { sku: "BAG-03", name: "Tote bag", price: 18, weightKg: 0.3 },
  { sku: "LMP-04", name: "Desk lamp", price: 64, weightKg: 1.8 },
  { sku: "PEN-05", name: "Fountain pen", price: 41, weightKg: 0.05 },
];

export const listProducts = () => PRODUCTS.slice();

export function findProduct(sku) {
  const p = PRODUCTS.find((x) => x.sku === sku);
  if (!p) throw new Error(`unknown sku: ${sku}`);
  return p;
}
