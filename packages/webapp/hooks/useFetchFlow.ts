import { useCallback, useState } from "react";

import { LoadResponse } from "@pusher/shared";

import { useFetchApi } from "./useFetchApi";
import { useStoreFlow } from "./useStoreFlow";

export const useFetchFlow = () => {
  const [loading, setLoading] = useState(false);

  const fetchApi = useFetchApi();

  const storeFlow = useStoreFlow();

  const fetchFlow = useCallback(
    async (id: string) => {
      if (loading) {
        return;
      }

      setLoading(true);

      const response = await fetchApi<LoadResponse>(
        "load",
        new URLSearchParams({ id })
      );

      if (response?.type === "success") {
        await storeFlow(response.flow);
      }

      setLoading(false);

      return response;
    },
    [fetchApi, loading, storeFlow]
  );

  return {
    loading,
    fetchFlow,
  };
};
