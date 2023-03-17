import { Action, ActionStore } from "../state/actions";

export const getPrevAction = (actions: ActionStore, action: Action) =>
  Object.values(actions).find(({ nextAction }) => action.id === nextAction);

export const getFirstParentAction = (actions: ActionStore, action: Action) => {
  let prevAction = getPrevAction(actions, action);
  let currentAction = action;

  let index = 1;

  while (prevAction) {
    currentAction = prevAction;
    index = index + 1;
    prevAction = getPrevAction(actions, prevAction);
  }

  return { index, action: currentAction };
};
