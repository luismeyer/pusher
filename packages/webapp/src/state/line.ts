import { selector } from "recoil";

import { actionIdsAtom } from "./actions";
import { ConnectType } from "./connect";
import { positionAtom } from "./position";
import { relationAtom } from "./relation";
import { sizeAtom } from "./size";

export type Line = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  type: ConnectType;
};

export const lineSelector = selector({
  key: `LineSelector`,
  get: ({ get }): Line[] => {
    const actionIds = get(actionIdsAtom);

    const createLine = (
      id: string,
      nextId: string,
      type: ConnectType
    ): Line => {
      const position = get(positionAtom(id));
      const size = get(sizeAtom(id));

      const nextPosition = get(positionAtom(nextId));
      const nextSize = get(sizeAtom(nextId));

      return {
        ax: position.x + size.width / 2,
        ay: position.y + size.height / 2,
        bx: nextPosition.x + nextSize.width / 2,
        by: nextPosition.y + nextSize.height / 2,
        type,
      };
    };

    return actionIds
      .map((actionId) => {
        const { nextAction, falseNextAction, trueNextAction } = get(
          relationAtom(actionId)
        );

        let lines: Line[] = [];

        if (nextAction) {
          lines = [...lines, createLine(actionId, nextAction, "default")];
        }

        if (falseNextAction) {
          lines = [...lines, createLine(actionId, falseNextAction, "false")];
        }

        if (trueNextAction) {
          lines = [...lines, createLine(actionId, trueNextAction, "true")];
        }

        return lines;
      })
      .reduce((acc, lines) => [...acc, ...lines], []);
  },
});
