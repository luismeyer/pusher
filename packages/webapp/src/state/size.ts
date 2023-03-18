import { atomFamily, useRecoilState } from "recoil";
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

export const useSizeAtom = (id: string) => useRecoilState(sizeAtom(id));
