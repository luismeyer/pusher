export type NavigationBaseAction = {
  nextAction: Action;
};

export type ClickAction = NavigationBaseAction & {
  type: "click";
  selector: string;
};

export type ScrollToBottomAction = NavigationBaseAction & {
  type: "scrollToBottom";
};

export type TimeoutAction = NavigationBaseAction & {
  type: "timeout";
  timeInSeconds: number;
};

export type WaitForAction = NavigationBaseAction & {
  type: "waitFor";
  selector: string;
};

export type OpenPageAction = NavigationBaseAction & {
  type: "openPage";
  pageUrl: string;
};

export type TypeAction = NavigationBaseAction & {
  type: "type";
  selector: string;
  text: string;
};

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

export type TelegramAction = {
  type: "telegram";
  message: string;
  chatId: string;
};

export type DecisionAction = ExistsAction | TextContentMatchesAction;

export type SelectorAction =
  | ClickAction
  | TypeAction
  | WaitForAction
  | ExistsAction
  | TextContentMatchesAction;

export type NavigationAction =
  | ClickAction
  | ScrollToBottomAction
  | TimeoutAction
  | WaitForAction
  | OpenPageAction
  | TypeAction;

export type OutputAction = TelegramAction;

export type Action = DecisionAction | NavigationAction | OutputAction;

export type Execution = {
  name: string;
  variables: Record<string, string>;
};

export type Flow = {
  name: string;
  id: string;
  fails: number;
  executions?: Execution[];
  actionTree: OpenPageAction;
};

export const isDecisionAction = (action: Action): action is DecisionAction =>
  action.type === "exists" || action.type === "textContentMatches";

export const isSelectorAction = (action: Action): action is SelectorAction =>
  "selector" in action;

export const isNavigationAction = (
  action: Action
): action is NavigationAction =>
  action.type === "click" ||
  action.type === "scrollToBottom" ||
  action.type === "timeout" ||
  action.type === "waitFor" ||
  action.type === "openPage" ||
  action.type === "type";
