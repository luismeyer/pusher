import { selectorFamily, useRecoilValue } from "recoil";

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
});

export const useNullableActionAtom = (id?: string) =>
  useRecoilValue(nullableActionSelector(id));
