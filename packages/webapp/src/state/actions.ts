import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

import { Action as Data } from "@pusher/shared";

import { removeItemAtIndex, replaceItemAtIndex } from "../utils/array";

export type Action = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  id: string;
  data: Data;
  nextAction?: string;
};

export type ActionStore = Action[];

export const actionsAtom = atom<ActionStore>({
  key: "ActionsAtom",
  default: [],
});

export const useActionsAtom = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const deleteAction = useCallback(
    (id: string) => {
      const prevIndex = actions.findIndex((action) => action.nextAction === id);
      const prevAction = actions[prevIndex];

      let newActions = [...actions];

      if (prevAction) {
        newActions = replaceItemAtIndex(actions, prevIndex, {
          ...prevAction,
          nextAction: undefined,
        });
      }

      const index = newActions.findIndex((action) => action.id === id);

      newActions = removeItemAtIndex(newActions, index);

      setActions(newActions);
    },
    [actions, setActions]
  );

  const addAction = useCallback(
    (action: Data) => {
      setActions([
        ...actions,
        {
          id: Math.floor(Math.random() * 1000).toString(),
          x: 10,
          y: 10,
          data: action,
        },
      ]);
    },
    [actions, setActions]
  );

  return {
    actions,
    addAction,
    deleteAction,
  };
};
