const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async <T>(
  path: "debug" | "submit" | "load",
  params?: URLSearchParams
): Promise<T> => {
  const url = `${apiBaseUrl}/${path}?${params?.toString()}`;

  return fetch(url).then((res) => res.json());
};
