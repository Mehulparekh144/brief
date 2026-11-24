Inventory.reserve(sku, qty) takes stock for an order from our warehouses. The warehouse team reports three problems:

- Orders take stock from the backup warehouses first.
- When there is not enough stock, reserve() raises OutOfStock, but some stock is gone anyway.
- reserve("SKU-1", -3) adds 3 units to a warehouse.

The rules:

1. Use warehouses in priority order: priority 1 first, then 2, and so on.
2. Warehouses with the same priority go by name, A to Z.
3. Take as much as possible from each warehouse before going to the next one.
4. All or nothing: if the total stock of the sku is less than qty, raise OutOfStock and change no stock.
5. qty below 1 raises ValueError and changes no stock.
6. Stock never goes below 0.
7. The return value stays the same: a list of (warehouse name, units taken), in the order used, only for warehouses that gave units.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
