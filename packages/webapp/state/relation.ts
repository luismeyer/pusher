import { atomFamily, selectorFamily } from "recoil";

import { actionIdsAtom } from "./actions";

export type Relation = {
  nextAction?: string;

  trueNextAction?: string;
  falseNextAction?: string;
};

export const relationAtom = atomFamily<Relation, string>({
  key: "Relation",
  effects: [],
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

export const previousActionsSelector = selectorFamily({
  key: "PreviousActions",
  get:
    (id: string) =>
    ({ get }) => {
      let parentId = get(parentActionSelector(id));
      let ids: string[] = [id];

      while (parentId) {
        ids = [...ids, parentId];
        parentId = get(parentActionSelector(parentId));
      }

      return ids;
    },
});

export const firstParentSelector = selectorFamily({
  key: "FirstParent",
  get:
    (id: string) =>
    ({ get }) => {
      const previousIds = get(previousActionsSelector(id));
      return previousIds[previousIds.length - 1];
    },
});

export const actionIndexSelector = selectorFamily({
  key: "ActionIndex",
  get:
    (id: string) =>
    ({ get }) => {
      const previousIds = get(previousActionsSelector(id));
      return previousIds.length;
    },
});
