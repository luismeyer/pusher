import { atomFamily, selectorFamily } from "recoil";

import { actionIdsAtom } from "./actions";
import { localStorageEffect } from "./localStorage";

export type Relation = {
  nextAction?: string;

  trueNextAction?: string;
  falseNextAction?: string;
};

export const relationAtom = atomFamily<Relation, string>({
  key: "Relation",
  effects: [localStorageEffect],
  default: {
    nextAction: undefined,
    trueNextAction: undefined,
    falseNextAction: undefined,
  },
});

export const parentActionSelector = selectorFamily({
  key: "PreviousAction",
  get:
    (id: string) =>
    ({ get }) => {
      const allActions = get(actionIdsAtom);

      return Object.values(allActions).find((actionId) => {
        const relation = get(relationAtom(actionId));

        return (
          relation.nextAction === id ||
          relation.trueNextAction === id ||
          relation.falseNextAction === id
        );
      });
    },
});

export const areConnectedSelector = selectorFamily({
  key: "AreConnected",
  get:
    (key: { start?: string; end?: string }) =>
    ({ get }) => {
      let parentId = get(parentActionSelector(key.start ?? ""));

      while (parentId) {
        if (parentId === key.end) {
          return true;
        }

        parentId = get(parentActionSelector(parentId));
      }

      return false;
    },
});

export const firstParentSelector = selectorFamily({
  key: "FirstParent",
  get:
    (id: string) =>
    ({ get }) => {
      let parentId = get(parentActionSelector(id));
      let currentId = id;

      while (parentId) {
        currentId = parentId;
        parentId = get(parentActionSelector(parentId));
      }

      return currentId;
    },
});

export const actionIndexSelector = selectorFamily({
  key: "ActionIndex",
  get:
    (id: string) =>
    ({ get }) => {
      let parentId = get(parentActionSelector(id));
      let index = 1;

      while (parentId) {
        index = index + 1;
        parentId = get(parentActionSelector(parentId));
      }

      return index;
    },
});
