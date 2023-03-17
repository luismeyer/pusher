import { useCallback, useEffect, useRef } from "react";

import { useDragIdAtom } from "../state/drag";
import { useNullableActionAtom } from "../state/nullableActionSelector";

export const useDrag = (canvas: React.RefObject<HTMLDivElement>) => {
  const [dragId] = useDragIdAtom();

  const [action, setAction] = useNullableActionAtom(dragId);

  // refs stores the offset of the pointer from the top left corner of the action
  const pointerActionOffsetX = useRef<number>();
  const pointerActionOffsetY = useRef<number>();

  // clear the pointer offset after dragging
  useEffect(() => {
    if (!action && pointerActionOffsetX.current) {
      pointerActionOffsetX.current = undefined;
    }

    if (!action && pointerActionOffsetY.current) {
      pointerActionOffsetY.current = undefined;
    }
  }, [action]);

  const handleDrag = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      if (!dragId || !action) {
        return;
      }

      const {
        clientHeight: canvasHeight = 0,
        clientWidth: canvasWidth = 0,
        offsetLeft: canvasOffsetX = 0,
        offsetTop: canvasOffsetY = 0,
      } = canvas.current ?? {};

      const { height: actionHeight = 0, width: actionWidth = 0 } = action;

      // set the pointer offset on the first drag event
      if (!pointerActionOffsetX.current) {
        pointerActionOffsetX.current = event.pageX - canvasOffsetX - action.x;
      }

      // set the pointer offset on the first drag event
      if (!pointerActionOffsetY.current) {
        pointerActionOffsetY.current = event.pageY - canvasOffsetY - action.y;
      }

      const newX = event.pageX - canvasOffsetX - pointerActionOffsetX.current;

      const newY = event.pageY - canvasOffsetY - pointerActionOffsetY.current;

      if (newX + actionWidth <= canvasWidth && newX >= 0) {
        setAction((prev) => prev && { ...prev, x: newX });
      }

      if (newY + actionHeight <= canvasHeight && newY >= 0) {
        setAction((prev) => prev && { ...prev, y: newY });
      }
    },
    [action, canvas, dragId, setAction]
  );

  return handleDrag;
};
