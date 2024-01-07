export const replaceItemInArray = <T>(array: T[], index: number, item: T) => {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
};

export const removeItemFromArray = <T>(array: T[], index: number) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};
