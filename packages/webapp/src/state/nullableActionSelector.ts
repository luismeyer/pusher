import { selectorFamily, useRecoilState, useRecoilValue } from "recoil";

import { actionsAtom, Action } from "./actions";

export const nullableActionSelector = selectorFamily<
  Action | undefined,
  string | undefined
>({
  key: `NullableActionSelectorFamily`,
  get:
    (actionId?: string) =>
    ({ get }): Action | undefined => {
      const { [actionId ?? ""]: action } = get(actionsAtom);

      return action;
    },
  set:
    (actionId?: string) =>
    ({ set, get }, newValue) => {
      const allActions = get(actionsAtom);

      if (!actionId) {
        return;
      }

      set(actionsAtom, { ...allActions, [actionId]: newValue as Action });
    },
});

export const useNullableActionAtom = (id?: string) =>
  useRecoilState(nullableActionSelector(id));
