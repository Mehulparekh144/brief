from loan import Loan

COLUMNS = ("month", "payment", "interest", "principal", "balance")


def render(loan: Loan) -> str:
    lines = ["  ".join(f"{c:>10}" for c in COLUMNS)]
    for row in loan.rows():
        lines.append("  ".join(f"{row[c]:>10}" for c in COLUMNS))
    return "\n".join(lines)


if __name__ == "__main__":
    print(render(Loan(10_000, 7.5, 12)))
