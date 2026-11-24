# inventory

Stock levels for our warehouses, and stock reservation for orders.

- `inventory/models.py` – Warehouse and OutOfStock
- `inventory/allocate.py` – the order in which warehouses are used
- `inventory/service.py` – Inventory: reserve stock, read totals
- `inventory/report.py` – the low-stock report

Run the tests with `python3 -m unittest discover -s tests -v`.
