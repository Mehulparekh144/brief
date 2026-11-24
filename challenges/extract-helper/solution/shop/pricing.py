from shop.validators import require_positive


def line_total(price, qty):
    """Price of one order line, rounded to cents."""
    require_positive("price", price)
    require_positive("qty", qty)
    return round(price * qty, 2)
