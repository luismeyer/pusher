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
import { positionAtom } from "../state/position";

export const useLoadFlow = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

    set(positionAtom(action.id), {
      x: actionData.x ?? 0,
      y: actionData.y ?? 0,
    });

    set(dataAtom(action.id), actionData);

    set(actionIdsAtom, (pre) => [...pre, action.id]);
  });

  const storeFlow = useRecoilCallback(({ set }) => async (flow: Flow) => {
    set(flowAtom, flow);

    await storeAction(flow.actionTree);
  });

  const loadFlow = useCallback(
    async (id: string) => {
      if (!router.isReady || loading) {
        return;
      }

      setLoading(true);

      const response = await fetchApi<LoadResponse>(
        "load",
        new URLSearchParams({ id: id })
      );

      if (response.type === "success") {
        await storeFlow(response.flow);
      }

      setLoading(false);

      return response;
    },
    [loading, router.isReady, storeFlow]
  );

  return {
    loading,
    loadFlow,
  };
};
