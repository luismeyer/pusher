import { RecoilState, selector, useRecoilState } from "recoil";
import { FrontendAction, actionsAtom } from "./actions";

let cache = new Map<string, RecoilState<FrontendAction>>();

export const actionSelector = (actionId: string) => {
  const cached = cache.get(actionId);

  if (cache.has(actionId) && cached) {
    return cached;
  }

  const func = selector({
    key: `ActionSelector-${actionId}`,
    get: ({ get }): FrontendAction => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      if (!action) {
        throw new Error("Trying to select non existing action " + actionId);
      }

      return action;
    },
    set({ set, get }, newValue) {
      const allActions = get(actionsAtom);

      const index = allActions.findIndex(({ id }) => id === actionId);

      const newAllActions = replaceItemAtIndex(
        allActions,
        index,
        newValue as FrontendAction
      );

      set(actionsAtom, newAllActions);
    },
  });

  cache.set(actionId, func);

  return func;
};

const replaceItemAtIndex = <T>(arr: T[], index: number, newValue: T): T[] => {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
};

export const useActionAtom = (id: string) => useRecoilState(actionSelector(id));
