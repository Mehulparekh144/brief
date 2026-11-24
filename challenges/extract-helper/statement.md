The same "is it a positive number?" check is copied in shop/pricing.py, shop/inventory.py and shop/shipping.py, and the copies have drifted. Put it in one helper.

- Create shop/validators.py with `require_positive(name, value)`.
- A valid value is an int or float, not a bool, finite (not NaN or infinity) and greater than 0. Return it unchanged.
- Otherwise raise ValueError with exactly this message: `{name} must be a positive number, got {value!r}`. Example: `price must be a positive number, got -1`.
- `line_total`, `restock` and `shipping_cost` call `require_positive` for each value they check. Pass the parameter name: `"price"`, `"qty"`, `"weight_kg"`.
- Delete the old copied checks. The three modules must do no other check on these values. A hidden test replaces the helper and checks each module calls it.
- Everything else in these modules stays the same.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
