import { useCallback, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

import { connectEndAtom, connectStartAtom } from "@/state/connection";
import {
  areConnectedSelector,
  parentActionSelector,
  relationAtom,
} from "@/state/relation";

export const useConnect = (id: string) => {
  const [connectStart, setConnectStart] = useRecoilState(connectStartAtom);
  const [connectEnd, setConnectEnd] = useRecoilState(connectEndAtom);

  const parentAction = useRecoilValue(parentActionSelector(id));

  const [relation, setRelation] = useRecoilState(relationAtom(id));

  const resetRelation = useResetRecoilState(relationAtom(id));

  const hasTransitiveConnection = useRecoilValue(
    areConnectedSelector({ start: connectStart, end: id })
  );

  // should the action allow a connecting click
  const allowConnect = useMemo(
    () =>
      connectStart &&
      connectStart !== id &&
      !parentAction &&
      !hasTransitiveConnection,
    [connectStart, hasTransitiveConnection, id, parentAction]
  );

  // runs in actionB to notifiy first action
  const connectPreviousAction = useCallback(() => {
    if (!allowConnect) {
      throw new Error("trying unallowd connection");
    }

    setConnectEnd(id);
  }, [allowConnect, id, setConnectEnd]);

  const handleConnectClick = useCallback(() => {
    // unconnect
    if (relation.nextAction) {
      resetRelation();
      return;
    }

    // start connection
    if (!connectStart) {
      setConnectStart(id);
      return;
    }

    // cancel connection
    if (connectStart === id) {
      setConnectStart(undefined);
      return;
    }
  }, [connectStart, id, relation.nextAction, resetRelation, setConnectStart]);

  // Effect runs when another action sets the actionB field
  // afterwards this first action can establish the connection
  useEffect(() => {
    if (connectStart !== id || !connectEnd) {
      return;
    }

    setRelation((prev) => ({ ...prev, nextAction: connectEnd }));
    setConnectStart(undefined);
    setConnectEnd(undefined);
  }, [
    connectEnd,
    connectStart,
    id,
    setConnectEnd,
    setConnectStart,
    setRelation,
  ]);

  return {
    connectPreviousAction,
    handleConnectionClick: handleConnectClick,
    allowConnection: allowConnect,
    relation,
    parentAction,
    isConnecting: Boolean(connectStart && !connectEnd),
    connectStart,
  };
};
