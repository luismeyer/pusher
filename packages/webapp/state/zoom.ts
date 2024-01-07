import { atom } from "recoil";

import { localStorageEffect } from "./localStorage";

export const zoomAtom = atom<number>({
  key: "Zoom",
  default: 1,
  effects: [localStorageEffect],
});
