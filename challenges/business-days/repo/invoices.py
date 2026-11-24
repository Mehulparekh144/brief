from dataclasses import dataclass
from datetime import date

from holidays_us import HOLIDAYS
from workdays import add_business_days

PAYMENT_TERMS_DAYS = 10


@dataclass
class Invoice:
    number: str
    issued: date
    amount_cents: int

    @property
    def due(self) -> date:
        return add_business_days(self.issued, PAYMENT_TERMS_DAYS, HOLIDAYS)

    def is_overdue(self, today: date) -> bool:
        return today > self.due
