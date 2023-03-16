import { RecoilValueReadOnly, selector, useRecoilValue } from "recoil";
import { FrontendAction, actionsAtom } from "./actions";

let cache = new Map<string, RecoilValueReadOnly<FrontendAction | undefined>>();

export const nullableActionSelector = (actionId = "") => {
  const cached = cache.get(actionId);

  if (cache.has(actionId) && cached) {
    return cached;
  }

  const func = selector({
    key: `NullableActionSelector-${actionId}`,
    get: ({ get }): FrontendAction | undefined => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      return action;
    },
  });

  cache.set(actionId, func);

  return func;
};

export const useNullableActionAtom = (id?: string) =>
  useRecoilValue(nullableActionSelector(id));
