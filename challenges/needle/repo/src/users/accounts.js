import { newId } from "../util/ids.js";

const accounts = new Map();

export function createAccount({ email, name }) {
  if (!/^[^@\s]+@[^@\s]+$/.test(email)) throw new Error("invalid email");
  const account = { id: newId("acc"), email: email.toLowerCase(), name, createdAt: new Date() };
  accounts.set(account.id, account);
  return account;
}

export const getAccount = (id) => accounts.get(id) ?? null;
