import { useCallback, useState } from "react";
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { v4 } from "uuid";

import { Action, isDecisionAction, isNavigationAction } from "@pusher/shared";

import { dataAtom } from "./data";
import { localStorageEffect } from "./localStorage";
import { positionAtom } from "./position";
import {
  firstParentSelector,
  parentActionSelector,
  relationAtom,
} from "./relation";
import { sizeAtom } from "./size";

export const actionIdsAtom = atom<string[]>({
  key: "ActionsAtom",
  default: [],
  effects: [localStorageEffect],
});

export const useDeleteAction = (id: string) => {
  const [actions, setActions] = useRecoilState(actionIdsAtom);

  const resetSize = useResetRecoilState(sizeAtom(id));
  const resetPosition = useResetRecoilState(positionAtom(id));

  const parent = useRecoilValue(parentActionSelector(id));
  const resetParentRelation = useResetRecoilState(relationAtom(parent ?? ""));

  const resetRelation = useResetRecoilState(relationAtom(id));

  const resetData = useResetRecoilState(dataAtom(id));

  return useCallback(() => {
    let newActions = actions.filter((actionId) => actionId !== id);

    if (parent) {
      resetParentRelation();
    }

    setActions(newActions);

    resetPosition();

    resetSize();

    resetData();

    resetRelation();
  }, [
    actions,
    id,
    parent,
    resetData,
    resetParentRelation,
    resetPosition,
    resetRelation,
    resetSize,
    setActions,
  ]);
};

export const useAddAction = () => {
  const setActions = useSetRecoilState(actionIdsAtom);

  const generateId = useCallback(() => v4(), []);

  const [id, setId] = useState(generateId);

  const setData = useSetRecoilState(dataAtom(id));

  const addAction = useCallback(
    (data: Action) => {
      setActions((pre) => [...pre, id]);

      setData(data);

      setId(generateId);
    },
    [generateId, id, setActions, setData]
  );

  return { id, addAction };
};

export const actionTreeSelector = selector({
  key: "ActionTree",
  get: ({ get }) => {
    const actionIds = get(actionIdsAtom);

    const firstAction = get(firstParentSelector(actionIds[0] ?? ""));

    const transformActions = (id: string): Action => {
      const data = get(dataAtom(id));

      if (!data) {
        throw new Error("Data not found " + id);
      }

      const relation = get(relationAtom(id));

      if (isNavigationAction(data)) {
        const nextAction = relation.nextAction
          ? transformActions(relation.nextAction)
          : undefined;

        return {
          ...data,
          nextAction,
        };
      }

      if (isDecisionAction(data)) {
        const trueNextAction = relation.trueNextAction
          ? transformActions(relation.trueNextAction)
          : undefined;

        const falseNextAction = relation.falseNextAction
          ? transformActions(relation.falseNextAction)
          : undefined;

        return {
          ...data,
          trueNextAction,
          falseNextAction,
        };
      }

      return data;
    };

    return transformActions(firstAction);
  },
});
