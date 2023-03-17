import { atom, useRecoilState } from "recoil";

export const dragIdAtom = atom<string | undefined>({
  key: "DragId",
  default: undefined,
});

export const useDragIdAtom = () => useRecoilState(dragIdAtom);
