import { selector } from "recoil";

import { actionIdsAtom } from "./actions";
import { positionAtom } from "./position";
import { relationAtom } from "./relation";
import { sizeAtom } from "./size";

export type Line = {
  ax: number;
  ay: number;
  bx: number;
  by: number;
};

export const lineSelector = selector({
  key: `LineSelector`,
  get: ({ get }): Line[] => {
    const actionIds = get(actionIdsAtom);

    const actionLines = actionIds
      .map((actionId) => {
        const { nextAction } = get(relationAtom(actionId));

        if (!nextAction) {
          return;
        }

        const position = get(positionAtom(actionId));
        const size = get(sizeAtom(actionId));

        const nextPosition = get(positionAtom(nextAction));
        const nextSize = get(sizeAtom(nextAction));

        return {
          ax: position.x + size.width / 2,
          ay: position.y + size.height / 2,
          bx: nextPosition.x + nextSize.width / 2,
          by: nextPosition.y + nextSize.height / 2,
        };
      })
      .filter((action): action is Line => Boolean(action));

    return [...actionLines];
  },
});
