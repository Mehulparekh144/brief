const orders = [];

export function recordOrder(order) {
  orders.push({ ...order, at: new Date() });
}

export const orderHistory = () => orders.slice();
