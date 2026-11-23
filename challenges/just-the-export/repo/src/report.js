import { formatMoney } from "./format.js";

// TODO: this grew over time. Clean it up one day (and maybe add CSV here?).
export function buildReport(orders) {
  var rows = [];
  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];
    var total = 0;
    for (var j = 0; j < o.items.length; j++) {
      total = total + o.items[j].price * o.items[j].qty;
    }
    var row = {};
    row.id = o.id;
    row.customer = o.customer;
    row.total = formatMoney(total);
    row.status = o.status;
    if (o.status == "refunded") {
      row.total = "-" + row.total;
    }
    rows.push(row);
  }
  return rows;
}
