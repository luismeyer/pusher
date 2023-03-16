import { atom, useRecoilState } from "recoil";

import { Action } from "@pusher/shared";

export type FrontendAction = {
  x: number;
  y: number;
  width?: number;
  height?: number;
  id: string;
  data: Action;
  nextAction?: string;
};

export type ActionStore = FrontendAction[];

export const actionsAtom = atom<ActionStore>({
  key: "ActionsAtom",
  default: [],
});

export const useActionsAtom = () => useRecoilState(actionsAtom);