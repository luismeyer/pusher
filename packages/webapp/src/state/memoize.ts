import { RecoilValue } from "recoil";

type FN<T> = (id?: string) => RecoilValue<T>;

export const memoize = <V>(fn: FN<V>): FN<V> => {
  const cache = new Map<string, RecoilValue<V>>();

  return (id = "") => {
    const cached = cache.get(id);

    if (cache.has(id) && cached) {
      return cached;
    }

    const result = fn(id);

    cache.set(id, result);

    return result;
  };
};
