import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

import { removeItemAtIndex, replaceItemAtIndex } from "@/utils/array";
import { Action as Data } from "@pusher/shared";

import { useDatasAtom } from "./data";

export type Action = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  id: string;

  nextAction?: string;
  trueNextAction?: string;
  falseNextAction?: string;
};

export type ActionStore = Action[];

export const actionsAtom = atom<ActionStore>({
  key: "ActionsAtom",
  default: [],
});

export const useActionsAtom = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const { addData, deleteData } = useDatasAtom();

  const deleteAction = useCallback(
    ({ id }: Action) => {
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

      deleteData(id);
    },
    [actions, deleteData, setActions]
  );

  const addAction = useCallback(
    (data: Data) => {
      const id = Math.floor(Math.random() * 1000).toString();

      setActions([
        ...actions,
        {
          id,
          x: 10,
          y: 10,
        },
      ]);

      addData(id, data);
    },
    [actions, addData, setActions]
  );

  return {
    actions,
    addAction,
    deleteAction,
  };
};
