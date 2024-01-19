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

export type BaseAction = {
  id: string;
  x?: number;
  y?: number;
};

export type Action = DecisionAction | NavigationAction | OutputAction;

export type Execution = {
  name: string;
  variables: Record<string, string>;
};

export const isInterval = (text: string): text is Flow["interval"] =>
  text === "6h" || text === "12h";

export type Flow = {
  user?: string;
  updatedAt?: string;
  name: string;
  id: string;
  fails: number;
  interval: "6h" | "12h";
  disabled: boolean;
  executions?: Execution[];
  actionTree: Action;
};
