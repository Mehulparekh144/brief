Students complain about their letter grades:

- A score of 92.5 gets A-. It must get A.
- A score of 87 gets B. It must get B+.

The rules:

1. Round the score half up to a whole number first: 92.5 → 93, 86.5 → 87, 92.49 → 92.
2. Then use this table:

| Rounded score | Grade |
|---|---|
| 93–100 | A |
| 90–92 | A- |
| 87–89 | B+ |
| 83–86 | B |
| 80–82 | B- |
| 77–79 | C+ |
| 73–76 | C |
| 70–72 | C- |
| 60–69 | D |
| 0–59 | F |

3. A score below 0 or above 100 still raises ValueError.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
