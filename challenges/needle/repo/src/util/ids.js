let counter = 0;

export const newId = (prefix) => `${prefix}_${Date.now().toString(36)}${(counter++).toString(36)}`;
