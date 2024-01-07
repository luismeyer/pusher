import { atomFamily } from "recoil";

import { localStorageEffect } from "./localStorage";

type SizeAndPosition = {
  width: number;
  height: number;
};

export const sizeAtom = atomFamily<SizeAndPosition, string>({
  key: "Size",
  effects: [localStorageEffect],
  default: {
    width: 0,
    height: 0,
  },
});
