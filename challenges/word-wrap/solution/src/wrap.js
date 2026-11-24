function wrapWords(words, width) {
  const lines = [];
  let line = "";
  for (let word of words) {
    if (word.length > width) {
      if (line) lines.push(line);
      while (word.length > width) {
        lines.push(word.slice(0, width));
        word = word.slice(width);
      }
      line = word;
    } else if (!line) line = word;
    else if (line.length + 1 + word.length <= width) line += ` ${word}`;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

/** Breaks text into lines of at most `width` characters. */
export function wrap(text, width) {
  return text
    .split(/\n\s*\n/) // blank lines, also ones with only spaces or tabs
    .map((p) => p.split(/\s+/).filter(Boolean))
    .filter((words) => words.length)
    .map((words) => wrapWords(words, width))
    .join("\n\n");
}
