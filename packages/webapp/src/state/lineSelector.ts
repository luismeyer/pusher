import { selector, useRecoilValue } from "recoil";

import { actionsAtom } from "./actions";
import { connectingAtom } from "./connecting";
import { positionAtom } from "./position";
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
    const allActions = get(actionsAtom);

    const connecting = get(connectingAtom);

    if (connecting.actionA && !connecting.actionB) {
    }

    const actionLines = Object.values(allActions)
      .map((action) => {
        const nextAction = allActions[action.nextAction ?? ""];

        if (!nextAction) {
          return;
        }

        const position = get(positionAtom(action.id));
        const size = get(sizeAtom(action.id));

        const nextPosition = get(positionAtom(nextAction.id));
        const nextSize = get(sizeAtom(nextAction.id));

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

export const useLineAtom = () => useRecoilValue(lineSelector);
