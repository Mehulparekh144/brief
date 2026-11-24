# invoicing

Creates invoices for the shop. Every invoice gets a number like `INV-2026-0042`.

- `src/invoices/numbering.js` – `nextInvoiceNumber(last, date)`
- `src/invoices/create.js` – `createInvoice(store, data, now)`
- `src/store.js` – an in-memory invoice store

Run the tests with `node --test test/*.test.js`.
