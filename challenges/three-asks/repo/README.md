# cart

Shopping cart totals with tax.

```js
import { calcTotal } from "./src/cart.js";

calcTotal([{ price: 10, qty: 2 }]); // { amount: 21.6, currency: "USD" }
```

Options: `currency`, `taxRate`. Defaults come from `src/config.js`.
