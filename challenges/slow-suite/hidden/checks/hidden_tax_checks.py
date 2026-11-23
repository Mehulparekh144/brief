from prices import receipt_totals
from tax import tax_for


def check_hidden_half_cent_rounds_up():
    assert tax_for(50.00) == 4.13, tax_for(50.00)
    assert tax_for(130.00) == 10.73, tax_for(130.00)
    assert tax_for(194.00) == 16.01, tax_for(194.00)


def check_hidden_other_amounts():
    assert tax_for(0) == 0
    assert tax_for(1.00) == 0.08
    assert tax_for(19.99) == 1.65


def check_hidden_returns_float():
    assert isinstance(tax_for(12.34), float)


def check_hidden_receipt_uses_rounded_tax():
    assert receipt_totals([(25.0, 2)]) == {"subtotal": 50.0, "tax": 4.13, "total": 54.13}
