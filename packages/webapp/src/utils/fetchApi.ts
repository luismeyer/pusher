import { loadToken } from "./auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const fetchApi = async <T>(
  path: "debug" | "submit" | "load" | "token",
  params?: URLSearchParams
): Promise<T | undefined> => {
  const query = params ? `?${params?.toString()}` : "";

  const url = `${apiBaseUrl}/${path}${query}`;

  const token = loadToken();
  const headers = token ? { Authorization: token } : undefined;

  return fetch(url, { headers }).then((res) => {
    if (res.status === 401) {
      return undefined;
    }

    return res.json();
  });
};
