import { selector, useRecoilValue } from "recoil";
import { FrontendAction, actionsAtom } from "./actions";
import { memoize } from "./memoize";

export const previousActionSelector = memoize((actionId = "") =>
  selector({
    key: `PreviousActionSelector-${actionId}`,
    get: ({ get }): FrontendAction | undefined => {
      const allActions = get(actionsAtom);

      const action = allActions.find(
        ({ nextAction }) => nextAction === actionId
      );

      return action;
    },
  })
);

export const usePreviousActionAtom = (id?: string) =>
  useRecoilValue(previousActionSelector(id));
