wrap(text, width) in src/wrap.js breaks text into lines for plain-text emails. It only splits on single spaces. Make it follow these rules:

1. Paragraphs are separated by one or more blank lines. A line with only spaces or tabs counts as blank.
2. In the output, paragraphs are separated by exactly one blank line.
3. Inside a paragraph, any run of spaces, tabs or single newlines counts as one space. A single newline in the input does not end a line in the output.
4. Put as many words on a line as fit. A line can be exactly width characters long.
5. A word longer than width starts on a new line. Cut it into pieces of width characters. The last piece is like a normal word: the next words can follow it on the same line.
6. No line starts or ends with a space. No blank lines at the start or the end, and no "\n" at the end.
7. Empty text, or text with only whitespace, gives "".

Lines are joined with "\n".

Done when: all tests pass, hidden ones too.
Check: node --test --test-reporter=tap test/*.test.js
