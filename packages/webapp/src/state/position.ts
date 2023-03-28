import { atomFamily, selectorFamily } from "recoil";
import { canvasAtom } from "./canvas";

import { localStorageEffect } from "./localStorage";
import { sizeAtom } from "./size";

type Position = {
  x: number;
  y: number;
};

export const positionAtom = atomFamily<Position, string>({
  key: "Position",
  effects: [localStorageEffect],
  default: selectorFamily({
    key: "Position/Default",
    get:
      (id: string) =>
      ({ get }) => {
        const size = get(sizeAtom(id));

        const canvas = get(canvasAtom);

        return {
          x: Math.abs(Math.floor(Math.random() * canvas.width) - size.width),
          y: Math.abs(Math.floor(Math.random() * canvas.height) - size.height),
        };
      },
  }),
});
