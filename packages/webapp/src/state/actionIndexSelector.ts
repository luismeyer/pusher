import { selectorFamily, useRecoilValue } from "recoil";
import { getFirstParentAction } from "../utils/action";

import { actionsAtom } from "./actions";

const actionIndexSelector = selectorFamily({
  key: "ActionIndexSelectorFamily",
  get:
    (actionId: string) =>
    ({ get }): number => {
      const { [actionId]: action, ...actions } = get(actionsAtom);

      if (!action) {
        throw new Error("Trying to select non existing action " + actionId);
      }

      const { index } = getFirstParentAction(actions, action);
      return index;
    },
});

export const useActionIndexAtom = (id: string) =>
  useRecoilValue(actionIndexSelector(id));
