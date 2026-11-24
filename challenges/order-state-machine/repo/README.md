# orders

Order lifecycle for the warehouse: pay, pack, ship, deliver or cancel.

```python
from orders.order import Order

order = Order(42)
order.pay()
order.pack()
order.ship()
order.status  # 'shipped'
```

`orders/service.py` runs the batch jobs (cancel unpaid orders, ship what is packed).

Run the tests with `python3 -m unittest discover -s tests -v`.
