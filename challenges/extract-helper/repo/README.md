# shop

Order math for the web shop: line totals, stock and shipping.

- `shop/pricing.py`: `line_total(price, qty)`
- `shop/inventory.py`: `restock(stock, sku, qty)`
- `shop/shipping.py`: `shipping_cost(weight_kg)`

Each function rejects values that are not positive numbers.

Run the tests with `python3 -m unittest discover -s tests -v`.
