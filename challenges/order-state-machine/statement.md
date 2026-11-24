Orders change state with no rules: a shipped order can be cancelled, and a paid order can skip packing. Put a state machine in orders/order.py.

States: new, paid, packed, shipped, delivered, cancelled.

| From | Allowed to |
|---|---|
| new | paid, cancelled |
| paid | packed, cancelled |
| packed | shipped, cancelled |
| shipped | delivered |
| delivered | nothing (final) |
| cancelled | nothing (final) |

- Add `Order.transition(to)`. `pay()`, `pack()`, `ship()`, `deliver()` and `cancel()` must each call it once.
- Each move appends a `(from, to)` tuple to `order.history`. A new order has an empty list.
- `order.is_final` is True for delivered and cancelled.
- Check the target name first: an unknown state raises `ValueError("unknown state: <name>")`. This is not an InvalidTransition.
- A move out of a final state raises `InvalidTransition("order <id> is <status> and cannot change")`.
- Any other move that is not in the table raises `InvalidTransition("cannot move order <id> from <from> to <to>")`.
- A failed move changes nothing: status and history stay the same.
- In orders/service.py, `cancel_all()` skips orders that cannot be cancelled, and `ship_ready()` ships only packed orders. Both return the ids they changed.

Done when: all tests pass, hidden ones too.
Check: python3 -m unittest discover -s tests -v
