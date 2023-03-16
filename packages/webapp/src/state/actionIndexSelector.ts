import { selector, useRecoilValue } from "recoil";

import { Action, actionsAtom } from "./actions";
import { memoize } from "./memoize";

const actionIndexSelector = memoize((actionId?: string) =>
  selector({
    key: `ActionIndexSelector-${actionId}`,
    get: ({ get }): number => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      if (!action) {
        throw new Error("Trying to select non existing action " + actionId);
      }

      const getPrevAction = (action: Action) => {
        return allActions.find(({ nextAction }) => action.id === nextAction);
      };

      let prevAction = getPrevAction(action);

      let index = 1;

      while (prevAction) {
        index = index + 1;
        prevAction = getPrevAction(prevAction);
      }

      return index;
    },
  })
);

export const useActionIndexAtom = (id: string) =>
  useRecoilValue(actionIndexSelector(id));
