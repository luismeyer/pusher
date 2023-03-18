import { atomFamily } from "recoil";
import { v4 } from "uuid";

import { Action } from "@pusher/shared";

import { localStorageEffect } from "./localStorage";

export const dataAtom = atomFamily<Action, string>({
  key: "Data",
  effects: [localStorageEffect],
  default: {
    id: v4(),
    type: "click",
    selector: "",
  },
});
