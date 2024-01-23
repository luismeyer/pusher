import { useCallback, useState } from "react";

import { useStoreFlow } from "./useStoreFlow";
import { loadAction } from "@/app/api/load.action";
import { useActionCall } from "./useActionCall";

export const useFetchFlow = () => {
  const [loading, setLoading] = useState(false);

  const storeFlow = useStoreFlow();

  const load = useActionCall(loadAction);

  const fetchFlow = useCallback(
    async (id: string) => {
      if (loading) {
        return;
      }

      setLoading(true);

      const response = await load(id);

      if (response?.type === "success" && response.data) {
        storeFlow(response.data);
      }

      setLoading(false);

      return response;
    },
    [load, loading, storeFlow]
  );

  return {
    loading,
    fetchFlow,
  };
};
