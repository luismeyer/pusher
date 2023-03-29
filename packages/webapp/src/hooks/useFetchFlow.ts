import { useRouter } from "next/router";
import { useCallback, useState } from "react";

import { useFetchApi } from "@/hooks/useFetchApi";
import { LoadResponse } from "@pusher/shared";

import { useStoreFlow } from "./useStoreFlow";

export const useFetchFlow = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fetchApi = useFetchApi();

  const storeFlow = useStoreFlow();

  const fetchFlow = useCallback(
    async (id: string) => {
      if (!router.isReady || loading) {
        return;
      }

      setLoading(true);

      const response = await fetchApi<LoadResponse>(
        "load",
        new URLSearchParams({ id: id })
      );

      if (response?.type === "success") {
        await storeFlow(response.flow);
      }

      setLoading(false);

      return response;
    },
    [fetchApi, loading, router.isReady, storeFlow]
  );

  return {
    loading,
    fetchFlow,
  };
};
