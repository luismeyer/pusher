import { useCallback } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";

import { Action as Data } from "@pusher/shared";

import { useDatasAtom } from "./data";
import { localStorageEffect } from "./localStorage";
import { sizeAtom } from "./size";
import { positionAtom } from "./position";

export type Action = {
  id: string;

  nextAction?: string;

  trueNextAction?: string;
  falseNextAction?: string;
};

export type ActionStore = Record<string, Action>;

export const actionsAtom = atom<ActionStore>({
  key: "ActionsAtom",
  default: {},
  effects: [localStorageEffect],
});

export const useDeleteAction = (id: string) => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const { deleteData } = useDatasAtom();

  const resetSize = useResetRecoilState(sizeAtom(id));
  const resetPosition = useResetRecoilState(positionAtom(id));

  return useCallback(() => {
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

    console.log(id, newActions);
    setActions(newActions);

    deleteData(id);

    resetPosition();

    resetSize();
  }, [actions, deleteData, id, resetPosition, resetSize, setActions]);
};

export const useAddAction = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const { addData } = useDatasAtom();

  return useCallback(
    (data: Data) => {
      const id = Math.floor(Math.random() * 1000).toString();

      setActions({
        ...actions,
        [id]: { id },
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
