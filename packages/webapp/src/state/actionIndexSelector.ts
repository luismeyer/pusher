import {
  RecoilValue,
  RecoilValueReadOnly,
  selector,
  useRecoilValue,
} from "recoil";
import { FrontendAction, actionsAtom } from "./actions";

const cache = new Map<string, RecoilValueReadOnly<number>>();

export const actionIndexSelector = (actionId: string) => {
  const cached = cache.get(actionId);

  if (cache.has(actionId) && cached) {
    return cached;
  }

  const func = selector({
    key: `ActionIndexSelector-${actionId}`,
    get: ({ get }): number => {
      const allActions = get(actionsAtom);

      const action = allActions.find(({ id }) => id === actionId);

      if (!action) {
        throw new Error("Trying to select non existing action " + actionId);
      }

      const getPrevAction = (action: FrontendAction) => {
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
  });

  cache.set(actionId, func);

  return func;
};

export const useActionIndexAtom = (id: string) =>
  useRecoilValue(actionIndexSelector(id));
