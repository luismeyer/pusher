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

export const isNavigationAction = (
  action: Action
): action is NavigationAction =>
  action.type === "click" ||
  action.type === "scrollToBottom" ||
  action.type === "timeout" ||
  action.type === "waitFor" ||
  action.type === "openPage" ||
  action.type === "type";

export type NavigationAction =
  | ClickAction
  | ScrollToBottomAction
  | TimeoutAction
  | WaitForAction
  | OpenPageAction
  | TypeAction;

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

export const isDecisionAction = (action: Action): action is DecisionAction =>
  action.type === "exists" || action.type === "textContentMatches";

export type DecisionAction = ExistsAction | TextContentMatchesAction;

export type TelegramAction = {
  type: "telegram";
  message: string;
  chatId: string;
};

export type OutputAction = TelegramAction;

export type Action = DecisionAction | NavigationAction | OutputAction;

export type Flow = {
  name: string;
  id: string;
  actions: OpenPageAction;
};
