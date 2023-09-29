export const arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
};

export const getKeyByValue = (object, value) =>
  Object.keys(object).find((key) => object[key] === value);
