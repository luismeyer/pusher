import { useCallback, useEffect } from "react";

import { useActionAtom } from "../state/actionSelector";
import { useConnectingAtom } from "../state/connecting";
import { usePreviousActionAtom } from "../state/previousActionSelector";

export const useConnection = (id: string, hovered: boolean) => {
  const [{ actionA, actionB }, setConnecting] = useConnectingAtom();

  const [action, setAction] = useActionAtom(id);

  const previousAction = usePreviousActionAtom(id);

  // runs in actionB to notifiy first action
  const connectPreviousAction = useCallback(() => {
    if (previousAction) {
      throw new Error("trying to connect to already connected action");
    }

    setConnecting((prev) => ({ ...prev, actionB: id }));
  }, [id, previousAction, setConnecting]);

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

  // should the action allow a connecting click
  const allowConnection =
    !previousAction && !action.nextAction && actionA && actionA !== id;

  // should the button that starts and cancels the connection be visible
  const showConnectionButton = (hovered && !actionA) || actionA === id;

  return {
    connectPreviousAction,
    handleConnectionClick,
    allowConnection,
    showConnectionButton,
  };
};
