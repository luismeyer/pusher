import type {
  ExistsAction,
  TextContentMatchesAction,
  DecisionAction,
} from "./decisionAction";
import type {
  ClickAction,
  TypeAction,
  WaitForAction,
  NavigationAction,
} from "./navigationAction";
import type { OutputAction } from "./outputAction";

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
  text === "1h" || text === "3h" || text === "6h" || text === "12h";

export type Flow = {
  user?: string;
  updatedAt?: string;
  name: string;
  id: string;
  fails: number;
  interval: "1h" | "3h" | "6h" | "12h";
  disabled: boolean;
  executions?: Execution[];
  actionTree: Action;
};
