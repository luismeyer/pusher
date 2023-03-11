export const timeout = (timeInSeconds: number) =>
  new Promise((res) => setTimeout(res, timeInSeconds * 1000));
