import { selectorFamily, useRecoilState } from "recoil";

import { actionsAtom, Action } from "./actions";

const actionSelector = selectorFamily({
  key: "ActionSelectorFamily",
  get:
    (actionId: string) =>
    ({ get }) => {
      const { [actionId]: action } = get(actionsAtom);

      if (!action) {
        throw new Error("Trying to select non existing action " + actionId);
      }

      return action;
    },
  set:
    (actionId: string) =>
    ({ set, get }, newValue) => {
      const allActions = get(actionsAtom);

      set(actionsAtom, { ...allActions, [actionId]: newValue as Action });
    },
});

export const useActionAtom = (id: string) => useRecoilState(actionSelector(id));
