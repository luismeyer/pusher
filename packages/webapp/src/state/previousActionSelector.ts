import { selectorFamily, useRecoilValue } from "recoil";
import { Action, actionsAtom } from "./actions";

export const previousActionSelector = selectorFamily<
  Action | undefined,
  string | undefined
>({
  key: "PreviousActionSelector",
  get:
    (actionId?: string) =>
    ({ get }): Action | undefined => {
      const allActions = get(actionsAtom);

      const action = Object.values(allActions).find(
        ({ nextAction }) => nextAction === actionId
      );

      return action;
    },
});

export const usePreviousActionAtom = (id?: string) =>
  useRecoilValue(previousActionSelector(id));
