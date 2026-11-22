from tax import tax_for


def check_simple_amount():
    assert tax_for(100) == 8.25


def check_six_dollars_rounds_up():
    assert tax_for(6) == 0.5, tax_for(6)
