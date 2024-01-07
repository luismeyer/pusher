import { useRef } from "react";
import { useRecoilCallback } from "recoil";

import { canvasAtom } from "@/state/canvas";
import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import { zoomAtom } from "@/state/zoom";

export const useDrag = () => {
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

        const position = await snapshot.getPromise(positionAtom(dragId));

        if (!position) {
          return;
        }

        const canvas = await snapshot.getPromise(canvasAtom);

        const { offSetX: canvasOffsetX = 0, offSetY: canvasOffsetY = 0 } =
          canvas;

        const zoom = await snapshot.getPromise(zoomAtom);

        const clientX = event.clientX / zoom;
        const clientY = event.clientY / zoom;

        // set the pointer offsetX on the first drag event
        if (!pointerActionOffsetX.current) {
          pointerActionOffsetX.current = clientX - canvasOffsetX - position.x;
        }

        // set the pointer offsetY on the first drag event
        if (!pointerActionOffsetY.current) {
          pointerActionOffsetY.current = clientY - canvasOffsetY - position.y;
        }

        const newX = clientX - canvasOffsetX - pointerActionOffsetX.current;

        const newY = clientY - canvasOffsetY - pointerActionOffsetY.current;

        set(positionAtom(dragId), (pre) => ({ ...pre, x: newX }));

        set(positionAtom(dragId), (pre) => ({ ...pre, y: newY }));
      },
    [pointerActionOffsetX.current, pointerActionOffsetY.current]
  );

  return handleDrag;
};
