import { useCallback, useEffect, useMemo } from "react";
import { useRecoilState, useRecoilValue, useResetRecoilState } from "recoil";

import {
  connectEndAtom,
  connectStartAtom,
  connectTypeAtom,
} from "@/state/connect";
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

  const [connectType, setConnectType] = useRecoilState(connectTypeAtom);

  const hasTransitiveConnection = useRecoilValue(
    areConnectedSelector({ start: connectStart, end: id }),
  );

  // should the action allow a connecting click
  const allowConnect = useMemo(() => {
    return (
      connectStart &&
      connectStart !== id &&
      !parentAction &&
      !hasTransitiveConnection
    );
  }, [connectStart, hasTransitiveConnection, id, parentAction]);

  // runs in connectEnd Action to notifiy connectStart Action
  const connectPreviousAction = useCallback(() => {
    setConnectEnd(id);
  }, [id, setConnectEnd]);

  // Effect runs when another action sets the connectEnd atom
  // afterwards this first action can establish the connection
  useEffect(() => {
    if (connectStart !== id || !connectEnd) {
      return;
    }

    switch (connectType) {
      case "default":
        setRelation((prev) => ({ ...prev, nextAction: connectEnd }));
        break;
      case "true":
        setRelation((prev) => ({ ...prev, trueNextAction: connectEnd }));
        break;
      case "false":
        setRelation((prev) => ({ ...prev, falseNextAction: connectEnd }));
        break;
    }

    setConnectStart(undefined);
    setConnectEnd(undefined);
    setConnectType(undefined);
  }, [
    connectEnd,
    connectStart,
    connectType,
    id,
    setConnectEnd,
    setConnectStart,
    setConnectType,
    setRelation,
  ]);

  return {
    connectPreviousAction,
    allowConnect,
    relation,
    parentAction,
    isConnecting: Boolean(connectStart && !connectEnd),
  };
};
