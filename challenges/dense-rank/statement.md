rank(players) in src/rank.js builds the leaderboard. It gives every player a different rank, also when scores tie. Make it follow these rules:

1. The input is an array of { name, score }. Players can have other fields too.
2. Sort by score, highest first.
3. Use dense ranks: players with the same score share a rank, and the next score gets the next number. Scores 100, 90, 90, 80 get ranks 1, 2, 2, 3 (not 1, 2, 2, 4).
4. Players with the same score are sorted by name, A to Z, ignoring case: "adam" comes before "Bob".
5. If two names are the same when you ignore case, keep their input order.
6. Return a new array of { rank, name, score }. Each item has only these three fields.

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
