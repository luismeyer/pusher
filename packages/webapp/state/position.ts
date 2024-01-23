import { atomFamily } from "recoil";

type Position = {
  x: number;
  y: number;
};

export const positionAtom = atomFamily<Position, string>({
  key: "Position",
  effects: [],
  default: {
    x: 25,
    y: 200,
  },
});
