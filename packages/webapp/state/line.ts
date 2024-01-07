import { atom, selectorFamily } from "recoil";

import { ConnectType } from "./connect";
import { positionAtom } from "./position";
import { relationAtom } from "./relation";
import { sizeAtom } from "./size";
import { zoomAtom } from "./zoom";

export type Line = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  type: ConnectType;
};

export const currentLineAtom = atom<Line | undefined>({
  key: "CurrentLine",
  default: undefined,
});

export const lineSelector = selectorFamily({
  key: `LineSelector`,
  get:
    (id: string) =>
    ({ get }): Line[] => {
      const createLine = (
        id: string,
        nextId: string,
        type: ConnectType
      ): Line => {
        const position = get(positionAtom(id));
        const size = get(sizeAtom(id));

        const nextPosition = get(positionAtom(nextId));
        const nextSize = get(sizeAtom(nextId));

        const zoom = get(zoomAtom);

        return {
          ax: position.x + size.width / 2 / zoom,
          ay: position.y + size.height / 2 / zoom,
          bx: nextPosition.x + nextSize.width / 2 / zoom,
          by: nextPosition.y + nextSize.height / 2 / zoom,
          type,
        };
      };

      const { nextAction, falseNextAction, trueNextAction } = get(
        relationAtom(id)
      );

      let lines: Line[] = [];

      if (nextAction) {
        lines = [...lines, createLine(id, nextAction, "default")];
      }

      if (falseNextAction) {
        lines = [...lines, createLine(id, falseNextAction, "false")];
      }

      if (trueNextAction) {
        lines = [...lines, createLine(id, trueNextAction, "true")];
      }

      return lines;
    },
});
