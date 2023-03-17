import {
  ExistsAction,
  TextContentMatchesAction,
  DecisionAction,
} from "./decisionAction";
import {
  ClickAction,
  TypeAction,
  WaitForAction,
  NavigationAction,
  OpenPageAction,
} from "./navigationAction";
import { OutputAction } from "./outputAction";

export type SelectorAction =
  | ClickAction
  | TypeAction
  | WaitForAction
  | ExistsAction
  | TextContentMatchesAction;

export const isSelectorAction = (action: Action): action is SelectorAction =>
  "selector" in action;

export type Action = DecisionAction | NavigationAction | OutputAction;

export type Execution = {
  name: string;
  variables: Record<string, string>;
};

export type Flow = {
  name: string;
  id: string;
  fails: number;
  interval: "6h" | "12h";
  executions?: Execution[];
  actionTree: Action;
};
