import { useCallback, useEffect, useRef } from "react";

import { useDragIdAtom } from "../state/drag";

import { usePositionAtom } from "../state/position";
import { useSizeAtom } from "../state/size";

export const useDrag = (canvas: React.RefObject<HTMLDivElement>) => {
  const [dragId] = useDragIdAtom();

  const [position, setPosition] = usePositionAtom(dragId ?? "");

  const [size] = useSizeAtom(dragId ?? "");

  // refs stores the offset of the pointer from the top left corner of the action
  const pointerActionOffsetX = useRef<number>();
  const pointerActionOffsetY = useRef<number>();

  // clear the pointer offset after dragging
  useEffect(() => {
    if (!dragId && pointerActionOffsetX.current) {
      pointerActionOffsetX.current = undefined;
    }

    if (!dragId && pointerActionOffsetY.current) {
      pointerActionOffsetY.current = undefined;
    }
  }, [dragId]);

  const handleDrag = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.preventDefault();

      if (!dragId) {
        return;
      }

      const {
        clientHeight: canvasHeight = 0,
        clientWidth: canvasWidth = 0,
        offsetLeft: canvasOffsetX = 0,
        offsetTop: canvasOffsetY = 0,
      } = canvas.current ?? {};

      const { height: actionHeight = 0, width: actionWidth = 0 } = size;

      // set the pointer offset on the first drag event
      if (!pointerActionOffsetX.current) {
        pointerActionOffsetX.current = event.pageX - canvasOffsetX - position.x;
      }

      // set the pointer offset on the first drag event
      if (!pointerActionOffsetY.current) {
        pointerActionOffsetY.current = event.pageY - canvasOffsetY - position.y;
      }

      const newX = event.pageX - canvasOffsetX - pointerActionOffsetX.current;

      const newY = event.pageY - canvasOffsetY - pointerActionOffsetY.current;

      if (newX + actionWidth <= canvasWidth && newX >= 0) {
        setPosition((prev) => prev && { ...prev, x: newX });
      }

      if (newY + actionHeight <= canvasHeight && newY >= 0) {
        setPosition((prev) => prev && { ...prev, y: newY });
      }
    },
    [canvas, dragId, position.x, position.y, setPosition, size]
  );

  return handleDrag;
};
