from shop.validators import require_positive


def restock(stock, sku, qty):
    """Add qty units of sku to the stock dict. Returns the new count."""
    require_positive("qty", qty)
    stock[sku] = stock.get(sku, 0) + qty
    return stock[sku]


def in_stock(stock, sku):
    return stock.get(sku, 0) > 0
