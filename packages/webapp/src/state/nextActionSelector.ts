import { RecoilValueReadOnly, selector, useRecoilValue } from "recoil";
import { FrontendAction, actionsAtom } from "./actions";

let actionSelectorCache = new Map<
  string,
  RecoilValueReadOnly<FrontendAction | undefined>
>();

export const nextActionSelector = (action: FrontendAction) => {
  const cached = actionSelectorCache.get(action.id);

  if (actionSelectorCache.has(action.id) && cached) {
    return cached;
  }

  const func = selector({
    key: `NextActionSelector-${action.id}`,
    get: ({ get }): FrontendAction | undefined => {
      const allActions = get(actionsAtom);

      return allActions.find(({ id }) => id === action.nextAction);
    },
  });

  actionSelectorCache.set(action.id, func);

  return func;
};

export const useNextActionAtom = (action: FrontendAction) =>
  useRecoilValue(nextActionSelector(action));
