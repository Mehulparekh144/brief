Finance reports two problems with invoice numbers:

- The first invoice of January 2026 got `INV-2026-0042`. The counter did not start again for the new year.
- After `INV-2026-9999` we issued `INV-2026-0000`, and then numbers repeated.

The rules for `nextInvoiceNumber(last, date)` in `src/invoices/numbering.js`:

1. The format is `INV-YYYY-NNNN`. `YYYY` is the UTC year of `date`.
2. The counter is the counter of `last` plus 1.
3. When the year of `date` is not the year in `last`, the counter starts again at `0001`.
4. With no last invoice (`null`), the counter is `0001`.
5. The counter has at least 4 digits, with leading zeros: `0001`, `0042`, `1000`.
6. After 9999 the counter keeps growing: `INV-2026-9999` → `INV-2026-10000` → `INV-2026-10001`.

Fix the bug. Do not change other files.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
