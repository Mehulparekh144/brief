Finance compared the daily revenue report with the bank. It does not match:
- Orders from the evening in New York show on the wrong day.
- Some days are a few cents short.
- The days come out in the order the orders came in.

Rules for dailyRevenue(orders):
- Group orders by their calendar date in UTC.
- Timestamps carry an offset. "2026-03-01T23:30:00-05:00" is 04:30 UTC on 2026-03-02, so it counts for 2026-03-02.
- Sum the amounts as whole cents. "19.99" three times is exactly 5997 cents.
- Sort the days from oldest to newest.
- Each row is `{ date: "YYYY-MM-DD", cents, orders }`, where `orders` is the order count for that day.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
