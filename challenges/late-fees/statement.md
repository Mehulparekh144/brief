Customers who pay on the due date get a late fee. They should not.

A payment is late only when it is made on a later calendar day (UTC) than the due date. A payment at 23:59 on the due date is on time.

Fix the bug. Do not change the public API.

Done when: all tests pass, hidden ones too.
Check: node --test test/*.test.js
