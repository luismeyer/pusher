import { useCallback, useEffect, useRef, useState } from "react";

import { useConnectingAtom } from "@/state/connecting";
import { useNullableActionAtom } from "@/state/nullableActionSelector";
import { Line as Points } from "@/state/lineSelector";

export const useCurrentLine = (
  canvasRef: React.RefObject<HTMLDivElement>,
  lines: React.RefObject<HTMLDivElement[]>
) => {
  const [connecting, setConnecting] = useConnectingAtom();

  const [actionA] = useNullableActionAtom(connecting.actionA);

  const currentLineRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState<Points | undefined>();

  const updateCurrentLine: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        if (!actionA || !actionA.width || !actionA.height) {
          return;
        }

        setCurrentLine({
          ax: actionA.x + actionA.width / 2,
          ay: actionA.y + actionA.height / 2,
          bx: event.pageX - (canvasRef.current?.offsetLeft ?? 0),
          by: event.pageY - (canvasRef.current?.offsetTop ?? 0),
        });
      },
      [actionA, canvasRef]
    );

  const handleCanvasClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      ({ target }) => {
        if (!currentLine) {
          return;
        }

        const isCanvasClick = target === canvasRef.current;
        const isCurrentLineClick = target === currentLineRef.current;
        const isLineClick = lines.current?.some((line) => target === line);

        // clear the current connection line if clicked anywhere
        if (isCanvasClick || isCurrentLineClick || isLineClick) {
          setConnecting({});
        }
      },
      [canvasRef, currentLine, lines, setConnecting]
    );

  // Clear the line if connecting canceled or finished
  useEffect(() => {
    if (currentLine && !actionA) {
      setCurrentLine(undefined);
    }
  }, [actionA, currentLine]);

  return {
    handleCanvasClick,
    updateCurrentLine,
    currentLine,
    currentLineRef,
  };
};
