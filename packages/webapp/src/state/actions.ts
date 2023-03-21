import { useCallback, useState } from "react";
import {
  atom,
  selector,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import { v4 } from "uuid";

import { Action, isDecisionAction, isNavigationAction } from "@pusher/shared";

import { dataAtom } from "./data";
import { localStorageEffect } from "./localStorage";

import {
  firstParentSelector,
  parentActionSelector,
  relationAtom,
} from "./relation";
import { positionAtom } from "./position";
import { sizeAtom } from "./size";

export const actionIdsAtom = atom<string[]>({
  key: "ActionsAtom",
  default: [],
  effects: [localStorageEffect],
});

export const useDeleteAction = (id: string) => {
  const [actions, setActions] = useRecoilState(actionIdsAtom);

  const parent = useRecoilValue(parentActionSelector(id));
  const resetParentRelation = useResetRecoilState(relationAtom(parent ?? ""));

  const resetData = useResetRecoilState(dataAtom(id));

  return useRecoilCallback(
    ({ reset }) =>
      async () => {
        let newActions = actions.filter((actionId) => actionId !== id);

        if (parent) {
          resetParentRelation();
        }

        setActions(newActions);

        reset(sizeAtom(id));
        reset(positionAtom(id));
        reset(relationAtom(id));
        reset(dataAtom(id));
      },
    [actions, id, parent, resetParentRelation, setActions]
  );
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
    const [actionId] = get(actionIdsAtom);

    if (!actionId) {
      return undefined;
    }

    const firstAction = get(firstParentSelector(actionId));

    const transformActions = (id: string): Action => {
      const data = get(dataAtom(id));

      if (!data) {
        throw new Error("Data not found " + id);
      }

      const relation = get(relationAtom(id));
      const position = get(positionAtom(id));

      if (isNavigationAction(data)) {
        const nextAction = relation.nextAction
          ? transformActions(relation.nextAction)
          : undefined;

        return {
          ...data,
          ...position,
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
          ...position,
          trueNextAction,
          falseNextAction,
        };
      }

      return {
        ...data,
        ...position,
      };
    };

    return transformActions(firstAction);
  },
});
