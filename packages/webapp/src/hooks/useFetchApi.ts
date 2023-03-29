import { useCallback } from "react";
import { useRecoilState } from "recoil";

import { authOpenAtom } from "@/state/auth";
import { loadToken } from "@/utils/auth";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export const useFetchApi = () => {
  const [authOpen, setAuthOpen] = useRecoilState(authOpenAtom);

  return useCallback(
    async <T>(
      path: "debug" | "submit" | "load" | "token" | "validate",
      params?: URLSearchParams
    ): Promise<T | undefined> => {
      const query = params ? `?${params?.toString()}` : "";

      const url = `${apiBaseUrl}/${path}${query}`;

      const token = loadToken();
      const headers = token ? { Authorization: token } : undefined;

      return fetch(url, { headers }).then((res) => {
        if (res.status === 401) {
          if (!authOpen) {
            setAuthOpen(true);
          }

          return undefined;
        }

        return res.json();
      });
    },
    [authOpen, setAuthOpen]
  );
};
