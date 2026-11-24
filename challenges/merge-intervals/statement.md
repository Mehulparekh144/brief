merge(intervals) in src/intervals.js joins busy time ranges for the calendar. Each interval is [start, end]. The function has bugs. Make it follow these rules:

1. Return the intervals sorted by start.
2. Overlapping intervals become one: [1, 4] and [2, 6] give [1, 6].
3. Touching intervals also become one: [1, 2] and [2, 3] give [1, 3].
4. An interval inside another one does not change it: [1, 10] and [2, 3] give [1, 10].
5. If an interval has start > end, throw a RangeError with the message `bad interval [5, 1]` (with its own numbers).
6. start equal to end is valid: [3, 3].
7. An empty list gives [].
8. Do not change the input array or its intervals. Return new arrays.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
