import time

from receipts import render


def check_full_receipt_render():
    time.sleep(9)  # stands in for the slow printer integration
    out = render([("Coffee", 3.5, 2), ("Bagel", 2.25, 1)])
    assert "Subtotal" in out and "9.25" in out


def check_long_receipt():
    time.sleep(9)
    out = render([(f"Item {i}", 1.0, 1) for i in range(40)])
    assert out.count("\n") == 43
