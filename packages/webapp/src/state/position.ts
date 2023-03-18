import { atomFamily } from "recoil";

import { localStorageEffect } from "./localStorage";

type SizeAndPosition = {
  x: number;
  y: number;
};

export const positionAtom = atomFamily<SizeAndPosition, string>({
  key: "Position",
  effects: [localStorageEffect],
  default: {
    x: 10,
    y: 10,
  },
});
