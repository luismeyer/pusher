import { atom } from "recoil";

export const zoomAtom = atom<number>({
  key: "Zoom",
  default: 1,
  effects: [],
});
