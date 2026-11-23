Finance wants the order report as CSV. Add it, and touch nothing else.

Create src/export/csv.js with toCSV(rows, columns):
1. The first line is the column names, joined by commas.
2. Then one line per row, with values in column order. A missing value is empty.
3. A value with a comma, a double quote or a newline goes in double quotes. Each double quote inside is doubled.
4. Numbers are written as String(n).
5. Lines are joined with "\n". No newline at the end.

Do not change any existing file. A hidden test checks that they are unchanged.

Done when: all tests pass, hidden ones too.
Check: node --test test/*.test.js
