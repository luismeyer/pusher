import { useRef } from "react";
import { useRecoilCallback } from "recoil";

import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";

export const useDrag = (canvas: React.RefObject<HTMLDivElement>) => {
  // refs stores the offset of the pointer from the top left corner of the action
  const pointerActionOffsetX = useRef<number>();
  const pointerActionOffsetY = useRef<number>();

  const updatePointerOffset = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        const dragId = await snapshot.getPromise(dragIdAtom);

        if (!dragId && pointerActionOffsetX.current) {
          pointerActionOffsetX.current = undefined;
        }

        if (!dragId && pointerActionOffsetY.current) {
          pointerActionOffsetY.current = undefined;
        }
      },
    []
  );

  const handleDrag = useRecoilCallback(
    ({ snapshot, set }) =>
      async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();

        await updatePointerOffset();

        const dragId = await snapshot.getPromise(dragIdAtom);

        if (!dragId) {
          return;
        }

        const { clientX, clientY } = event;

        const position = await snapshot.getPromise(positionAtom(dragId));
        const size = await snapshot.getPromise(sizeAtom(dragId));

        if (!position) {
          return;
        }

        const {
          scrollHeight: canvasHeight = 0,
          scrollWidth: canvasWidth = 0,
          offsetLeft: canvasOffsetX = 0,
          offsetTop: canvasOffsetY = 0,
        } = canvas.current ?? {};

        const { height: actionHeight = 0, width: actionWidth = 0 } = size;

        // set the pointer offset on the first drag event
        if (!pointerActionOffsetX.current) {
          pointerActionOffsetX.current = clientX - canvasOffsetX - position.x;
        }

        // set the pointer offset on the first drag event
        if (!pointerActionOffsetY.current) {
          pointerActionOffsetY.current = clientY - canvasOffsetY - position.y;
        }

        const newX = clientX - canvasOffsetX - pointerActionOffsetX.current;

        const newY = clientY - canvasOffsetY - pointerActionOffsetY.current;

        if (newX + actionWidth <= canvasWidth && newX >= 0) {
          set(positionAtom(dragId), (pre) => ({ ...pre, x: newX }));
        }

        if (newY + actionHeight <= canvasHeight && newY >= 0) {
          set(positionAtom(dragId), (pre) => ({ ...pre, y: newY }));
        }
      },
    [pointerActionOffsetX.current, pointerActionOffsetY.current, canvas.current]
  );

  return handleDrag;
};
