import { useCallback, useEffect, useMemo } from "react";

import { Action, useActionsAtom } from "@/state/actions";
import { useActionAtom } from "@/state/actionSelector";
import { useConnectingAtom } from "@/state/connecting";
import { usePreviousActionAtom } from "@/state/previousActionSelector";

export const useConnection = (id: string) => {
  const [{ actionA, actionB }, setConnecting] = useConnectingAtom();

  const [action, setAction] = useActionAtom(id);

  const previousAction = usePreviousActionAtom(id);

  const { actionsStore } = useActionsAtom();

  const hasTransitiveConnection = useCallback(
    (action: Action): boolean => {
      const nextAction = actionsStore[action.nextAction ?? ""];

      if (!nextAction) {
        return false;
      }

      return nextAction.id === actionA || hasTransitiveConnection(nextAction);
    },
    [actionsStore, actionA]
  );

  // should the action allow a connecting click
  const allowConnection = useMemo(() => {
    return (
      actionA &&
      actionA !== id &&
      !previousAction &&
      !hasTransitiveConnection(action)
    );
  }, [action, actionA, hasTransitiveConnection, id, previousAction]);

  // runs in actionB to notifiy first action
  const connectPreviousAction = useCallback(() => {
    if (!allowConnection) {
      throw new Error("trying unallowd connection");
    }

    setConnecting((prev) => ({ ...prev, actionB: id }));
  }, [allowConnection, id, setConnecting]);

  const handleConnectionClick = useCallback(() => {
    // unconnect
    if (action.nextAction) {
      setAction((prev) => ({ ...prev, nextAction: undefined }));
      return;
    }

    // start connection
    if (!actionA) {
      setConnecting({ actionA: id });
      return;
    }

    // cancel connection
    if (actionA === id) {
      setConnecting({});
      return;
    }
  }, [action.nextAction, actionA, id, setAction, setConnecting]);

  // Effect runs when another action sets the actionB field
  // afterwards this first action can establish the connection
  useEffect(() => {
    if (actionA !== id || !actionB) {
      return;
    }

    setAction((prev) => ({ ...prev, nextAction: actionB }));
    setConnecting({});
  }, [action, actionA, actionB, id, setAction, setConnecting]);

  return {
    connectPreviousAction,
    handleConnectionClick,
    previousAction,
    allowConnection,
    isConnecting: Boolean(actionA && !actionB),
  };
};
