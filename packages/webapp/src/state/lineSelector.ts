import { selector, useRecoilValue } from "recoil";

import { actionsAtom } from "./actions";
import { connectingAtom } from "./connecting";

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

    const actionLines = allActions
      .map((action) => {
        const nextAction = allActions.find(
          ({ id }) => action.nextAction === id
        );

        if (!nextAction) {
          return;
        }

        const aWidth = action.width ?? 0;
        const aHeight = action.height ?? 0;
        const bWidth = nextAction.width ?? 0;
        const bHeight = nextAction.height ?? 0;

        return {
          ax: action.x + aWidth / 2,
          ay: action.y + aHeight / 2,
          bx: nextAction.x + bWidth / 2,
          by: nextAction.y + bHeight / 2,
        };
      })
      .filter((action): action is Line => Boolean(action));

    return [...actionLines];
  },
});

export const useLineAtom = () => useRecoilValue(lineSelector);
