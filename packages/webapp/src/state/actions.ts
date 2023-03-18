import { useCallback, useState } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
} from "recoil";
import { v4 } from "uuid";

import { Action as Data } from "@pusher/shared";

import { useDataAtom, useDeleteData } from "./data";
import { localStorageEffect } from "./localStorage";
import { positionAtom } from "./position";
import { sizeAtom } from "./size";

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

  const deleteData = useDeleteData(id);

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

    setActions(newActions);

    deleteData();

    resetPosition();

    resetSize();
  }, [actions, deleteData, id, resetPosition, resetSize, setActions]);
};

export const useAddAction = () => {
  const [actions, setActions] = useRecoilState(actionsAtom);

  const generateId = useCallback(() => v4(), []);

  const [newId, setNewId] = useState(generateId);

  const [_data, setData] = useDataAtom(newId);

  const addAction = useCallback(
    (data: Data) => {
      setActions({ ...actions, [newId]: { id: newId } });

      setData(data);

      setNewId(generateId);
    },
    [actions, generateId, newId, setActions, setData]
  );

  return addAction;
};

export const useActionsAtom = () => {
  const actionsStore = useRecoilValue(actionsAtom);

  return {
    actionsStore,
    actions: Object.values(actionsStore),
  };
};
