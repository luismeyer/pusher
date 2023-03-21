import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import { actionIdsAtom } from "@/state/actions";
import { dataAtom } from "@/state/data";
import { flowAtom } from "@/state/flow";
import { relationAtom } from "@/state/relation";
import { fetchApi } from "@/utils/fetchApi";
import {
  Action,
  Flow,
  isDecisionAction,
  isNavigationAction,
  LoadResponse,
} from "@pusher/shared";

export const useLoadFlow = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const hasData = useRef(false);

  const storeAction = useRecoilCallback(({ set }) => async (action: Action) => {
    let actionData = action;

    if (isDecisionAction(action)) {
      const { falseNextAction, trueNextAction, ...rest } = action;
      actionData = rest;

      if (falseNextAction) {
        set(relationAtom(action.id), (pre) => ({
          ...pre,
          falseNextAction: falseNextAction?.id,
        }));

        await storeAction(falseNextAction);
      }

      if (trueNextAction) {
        set(relationAtom(action.id), (pre) => ({
          ...pre,
          trueNextAction: trueNextAction?.id,
        }));

        await storeAction(trueNextAction);
      }
    }

    if (isNavigationAction(action)) {
      const { nextAction, ...rest } = action;
      actionData = rest;

      if (nextAction) {
        set(relationAtom(action.id), { nextAction: nextAction?.id });

        await storeAction(nextAction);
      }
    }

    set(dataAtom(action.id), actionData);

    set(actionIdsAtom, (pre) => [...pre, action.id]);
  });

  const storeFlow = useRecoilCallback(({ set }) => async (flow: Flow) => {
    set(flowAtom, flow);

    await storeAction(flow.actionTree);
  });

  const loadData = useCallback(
    async (id: string) => {
      const response = await fetchApi<LoadResponse>(
        "load",
        new URLSearchParams({ id: id })
      );

      hasData.current = true;

      if (response.type === "success") {
        await storeFlow(response.flow);
      }

      setLoading(false);
    },
    [storeFlow]
  );

  useEffect(() => {
    if (!router.isReady || loading || hasData.current) {
      return;
    }

    const { id } = router.query;

    if (typeof id !== "string") {
      router.push("/console");

      hasData.current = true;
      setLoading(false);

      return;
    }

    setLoading(true);

    loadData(id);
  }, [loadData, loading, router]);

  return loading;
};
