import { selector, useRecoilValue } from "recoil";

import { actionsAtom, Action } from "./actions";
import { memoize } from "./memoize";

export const nullableActionSelector = memoize((actionId = "") =>
  selector({
    key: `NullableActionSelector-${actionId}`,
    get: ({ get }): Action | undefined => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      return action;
    },
  })
);

export const useNullableActionAtom = (id?: string) =>
  useRecoilValue(nullableActionSelector(id));
