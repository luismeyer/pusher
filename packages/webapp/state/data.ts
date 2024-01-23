import { atomFamily } from "recoil";
import { v4 } from "uuid";

import { Action } from "@pusher/shared";

export const dataAtom = atomFamily<Action, string>({
  key: "Data",
  effects: [],
  default: {
    id: v4(),
    type: "click",
    selector: "",
  },
});
