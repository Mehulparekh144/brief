import datetime as dt

from dates.parsing import parse_date


def due_date(invoice):
    """Issue date plus the payment terms in days (default 30)."""
    return parse_date(invoice["issued"]) + dt.timedelta(days=invoice.get("terms", 30))


def is_overdue(invoice, today):
    return not invoice.get("paid", False) and parse_date(today) > due_date(invoice)
