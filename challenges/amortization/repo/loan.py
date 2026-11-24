from dataclasses import dataclass

from amortization import schedule


@dataclass
class Loan:
    principal: object
    annual_rate_percent: object
    months: int

    def rows(self):
        return schedule(self.principal, self.annual_rate_percent, self.months)

    def total_paid(self):
        return sum(row["payment"] for row in self.rows())

    def total_interest(self):
        return sum(row["interest"] for row in self.rows())
