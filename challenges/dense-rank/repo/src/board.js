/** One line per row: " 1. Ann ........ 42" */
export function formatBoard(rows, width = 24) {
  return rows
    .map(({ rank, name, score }) => {
      const left = `${String(rank).padStart(2)}. ${name} `;
      return left + ".".repeat(Math.max(1, width - left.length - String(score).length - 1)) + ` ${score}`;
    })
    .join("\n");
}
