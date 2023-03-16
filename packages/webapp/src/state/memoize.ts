type FN<T> = (id?: string) => T;

export const memoize = <V>(fn: FN<V>): FN<V> => {
  const cache = new Map<string, V>();

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
