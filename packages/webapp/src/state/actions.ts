import { useCallback } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";

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

export type ActionStore = Record<string, Action>;

export const actionsAtom = atom<ActionStore>({
  key: "ActionsAtom",
  default: {},
});

export const useDeleteAction = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const { deleteData } = useDatasAtom();

  return useCallback(
    ({ id }: Action) => {
      let { [id]: deleted, ...newActions } = actions;

      const prevAction = Object.values(newActions).find(
        (action) => action.nextAction === id
      );

      if (prevAction) {
        newActions = {
          ...newActions,

          [prevAction.id]: { ...prevAction, nextAction: undefined },
        };
      }

      setActions(newActions);

      deleteData(id);
    },
    [actions, deleteData, setActions]
  );
};

export const useAddAction = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const { addData } = useDatasAtom();

  return useCallback(
    (data: Data) => {
      const id = Math.floor(Math.random() * 1000).toString();

      setActions({
        ...actions,
        [id]: { id, x: 10, y: 10 },
      });

      addData(id, data);
    },
    [actions, addData, setActions]
  );
};

export const useActionsAtom = () => {
  const actionsStore = useRecoilValue(actionsAtom);

  return {
    actionsStore,
    actions: Object.values(actionsStore),
  };
};
