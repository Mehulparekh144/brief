/** In-memory invoice store. The real one is a database table with the same methods. */
export function createStore() {
  const invoices = [];
  return {
    lastNumber: () => invoices.at(-1)?.number ?? null,
    save(invoice) {
      invoices.push(invoice);
      return invoice;
    },
    all: () => [...invoices],
  };
}
