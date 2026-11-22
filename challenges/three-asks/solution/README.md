# cart

Shopping cart totals with tax.

```js
import { calculateTotal } from "./src/cart.js";

calculateTotal([{ price: 10, qty: 2 }]); // { amount: 21.6, currency: "EUR" }
calculateTotal([{ price: 10, qty: 2 }], { discount: 0.5 }); // { amount: 10.8, currency: "EUR" }
```

Options: `currency`, `taxRate`, `discount` (0–1, before tax). Defaults come from `src/config.js`.
