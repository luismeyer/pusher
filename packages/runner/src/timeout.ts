export const timeout = (timeInSeconds: number) =>
  new Promise((res) => setTimeout(() => res(true), timeInSeconds * 1000));
