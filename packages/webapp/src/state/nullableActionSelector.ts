import { selector, useRecoilValue } from "recoil";

import { actionsAtom, FrontendAction } from "./actions";
import { memoize } from "./memoize";

export const nullableActionSelector = memoize((actionId = "") =>
  selector({
    key: `NullableActionSelector-${actionId}`,
    get: ({ get }): FrontendAction | undefined => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      return action;
    },
  })
);

export const useNullableActionAtom = (id?: string) =>
  useRecoilValue(nullableActionSelector(id));
