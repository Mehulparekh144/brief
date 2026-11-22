from prices import line_total, receipt_totals


def check_line_total():
    assert line_total(2.5, 4) == 10.0


def check_receipt_without_tax_edge():
    t = receipt_totals([(100.0, 1)])
    assert t == {"subtotal": 100.0, "tax": 8.25, "total": 108.25}, t
