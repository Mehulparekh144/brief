Users report that page 1 of the posts list shows the second page. The newest 10 posts never show.

Rules for paginate(items, page, size):
- Pages start at 1. Page 1 starts with the first item.
- Each page has `size` items. The last page can have fewer.
- A page past the end returns an empty `items` list. It keeps the requested page number. It does not jump back to the last page.
- `totalPages` is the item count divided by `size`, rounded up. No items gives 0.
- The result stays `{ items, page, size, total, totalPages }`.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
