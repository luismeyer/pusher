import { useCallback, useRef, useState } from "react";

import { useActionAtom } from "@/state/actionSelector";

export const useDragAndDrop = (
  id: string,
  ref: React.RefObject<HTMLDivElement>,
  canvas: React.RefObject<HTMLDivElement>
) => {
  const [_action, setAction] = useActionAtom(id);

  const actionOffsetY = useRef(0);
  const actionOffsetX = useRef(0);

  const [dragging, setDragging] = useState(false);

  const canvasOffsetX = canvas.current?.offsetLeft ?? 0;
  const canvasOffsetY = canvas.current?.offsetTop ?? 0;
  const canvasWidth = canvas.current?.clientWidth ?? 0;
  const canvasHeight = canvas.current?.clientHeight ?? 0;

  const actionOffsetLeft = ref.current?.offsetLeft ?? 0;
  const actionOffsetTop = ref.current?.offsetTop ?? 0;
  const actionWidth = ref.current?.clientWidth ?? 0;
  const actionHeight = ref.current?.clientHeight ?? 0;

  const handleDrag = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      const newX = event.pageX - canvasOffsetX - actionOffsetX.current;
      const newY = event.pageY - canvasOffsetY - actionOffsetY.current;

      if (newX + actionWidth <= canvasWidth && newX >= 0) {
        setAction((prev) => ({ ...prev, x: newX }));
      }

      if (newY + actionHeight <= canvasHeight && newY >= 0) {
        setAction((prev) => ({ ...prev, y: newY }));
      }
    },
    [
      actionHeight,
      actionWidth,
      canvasHeight,
      canvasOffsetX,
      canvasOffsetY,
      canvasWidth,
      setAction,
    ]
  );

  const dragEnd = useCallback(() => {
    setDragging(false);

    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", dragEnd);
  }, [handleDrag]);

  const dragStart: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      setDragging(true);

      actionOffsetX.current = event.pageX - canvasOffsetX - actionOffsetLeft;
      actionOffsetY.current = event.pageY - canvasOffsetY - actionOffsetTop;

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", dragEnd);
    },
    [
      actionOffsetLeft,
      actionOffsetTop,
      canvasOffsetX,
      canvasOffsetY,
      dragEnd,
      handleDrag,
    ]
  );

  return {
    dragStart,
    dragging,
  };
};
