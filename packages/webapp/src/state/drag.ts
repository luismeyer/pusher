import { atom } from "recoil";

export const dragIdAtom = atom<string | undefined>({
  key: "DragId",
  default: undefined,
});
