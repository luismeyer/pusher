import { atomFamily } from "recoil";

import { localStorageEffect } from "./localStorage";

type Position = {
  x: number;
  y: number;
};

export const positionAtom = atomFamily<Position, string>({
  key: "Position",
  effects: [localStorageEffect],
  default: {
    x: 10,
    y: 10,
  },
});
