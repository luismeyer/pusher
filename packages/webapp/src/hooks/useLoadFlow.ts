import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilCallback } from "recoil";

import {
  Action,
  Flow,
  isDecisionAction,
  isNavigationAction,
  LoadResponse,
} from "@pusher/shared";

import { dataAtom } from "../state/data";
import { flowAtom } from "../state/flow";
import { relationAtom } from "../state/relation";
import { fetchApi } from "../utils/fetchApi";
import { actionIdsAtom } from "../state/actions";

export const useLoadFlow = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const hasData = useRef(false);

  const storeAction = useRecoilCallback(({ set }) => async (action: Action) => {
    let actionData = action;

    if (isDecisionAction(action)) {
      const { falseNextAction, trueNextAction, ...rest } = action;
      actionData = rest;

      set(relationAtom(action.id), {
        falseNextAction: falseNextAction?.id,
        trueNextAction: trueNextAction?.id,
      });

      if (falseNextAction) {
        await storeAction(falseNextAction);
      }

      if (trueNextAction) {
        await storeAction(trueNextAction);
      }
    }

    if (isNavigationAction(action)) {
      const { nextAction, ...rest } = action;
      actionData = rest;

      set(relationAtom(action.id), { nextAction: nextAction?.id });

      if (nextAction) {
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
      console.log("loadData", id);
      const response = await fetchApi<LoadResponse>(
        "load",
        new URLSearchParams({ id: id })
      );

      hasData.current = true;

      if (response.type === "error") {
        router.push("/console");
      }

      if (response.type === "success") {
        await storeFlow(response.flow);
      }

      setLoading(false);
    },
    [router, storeFlow]
  );

  useEffect(() => {
    if (!router.isReady || loading || hasData.current) {
      return;
    }

    setLoading(true);

    const { id } = router.query;

    if (typeof id !== "string") {
      router.push("/console");
      setLoading(false);

      return;
    }

    loadData(id);
  }, [loadData, loading, router]);

  return loading;
};
