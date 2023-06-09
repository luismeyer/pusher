import { Action, BaseAction } from "./flow";
import { Key } from "./keyboard";

export type NavigationBaseAction = BaseAction & {
  nextAction?: Action;
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

export type StoreTextContentAction = NavigationBaseAction & {
  type: "storeTextContent";
  selector: string;
  variableName: string;
};

export type KeyboardAction = NavigationBaseAction & {
  type: "keyboard";
  key: Key;
};

export type NavigationAction =
  | ClickAction
  | ScrollToBottomAction
  | TimeoutAction
  | WaitForAction
  | OpenPageAction
  | TypeAction
  | StoreTextContentAction
  | KeyboardAction;

export const isNavigationAction = (
  action: Action
): action is NavigationAction =>
  action.type === "click" ||
  action.type === "scrollToBottom" ||
  action.type === "timeout" ||
  action.type === "waitFor" ||
  action.type === "openPage" ||
  action.type === "type" ||
  action.type === "storeTextContent" ||
  action.type === "keyboard";
