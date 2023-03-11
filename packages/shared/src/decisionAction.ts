import { Action } from "./flow";

export type DecisionBaseAction = {
  trueNextAction: Action;
  falseNextAction: Action;
};

export type ExistsAction = DecisionBaseAction & {
  type: "exists";
  selector: string;
};

export type TextContentMatchesAction = DecisionBaseAction & {
  type: "textContentMatches";
  textContent: string;
  selector: string;
};

export type DecisionAction = ExistsAction | TextContentMatchesAction;

export const isDecisionAction = (action: Action): action is DecisionAction =>
  action.type === "exists" || action.type === "textContentMatches";
