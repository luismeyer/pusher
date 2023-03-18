import { Action, BaseAction } from "./flow";

export type DecisionBaseAction = BaseAction & {
  trueNextAction?: Action;
  falseNextAction?: Action;
};

export type ExistsAction = DecisionBaseAction & {
  type: "exists";
  selector: string;
};

export type TextContentMatchesAction = DecisionBaseAction & {
  type: "textContentMatches";
  text: string;
  selector: string;
};

export type DecisionAction = ExistsAction | TextContentMatchesAction;

export const isDecisionAction = (action: Action): action is DecisionAction =>
  action.type === "exists" || action.type === "textContentMatches";
