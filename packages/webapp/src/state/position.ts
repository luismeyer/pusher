import { atomFamily, useRecoilState } from "recoil";
import { localStorageEffect } from "./localStorage";

type SizeAndPosition = {
  x: number;
  y: number;
};

export const positionAtom = atomFamily<SizeAndPosition, string>({
  key: "Position",
  effects: [localStorageEffect],
  default: {
    x: 0,
    y: 0,
  },
});

export const usePositionAtom = (id: string) => useRecoilState(positionAtom(id));
