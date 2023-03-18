import { useCallback, useEffect, useRef, useState } from "react";

import { useConnectingAtom } from "@/state/connecting";
import { Line as Points } from "@/state/lineSelector";
import { usePositionAtom } from "@/state/position";
import { useSizeAtom } from "@/state/size";

export const useCurrentLine = (
  canvasRef: React.RefObject<HTMLDivElement>,
  lines: React.RefObject<HTMLDivElement[]>
) => {
  const [connecting, setConnecting] = useConnectingAtom();

  const [position] = usePositionAtom(connecting.actionA ?? "");

  const [size] = useSizeAtom(connecting.actionA ?? "");

  const currentLineRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState<Points | undefined>();

  const updateCurrentLine: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        if (!connecting.actionA) {
          return;
        }

        setCurrentLine({
          ax: position.x + size.width / 2,
          ay: position.y + size.height / 2,
          bx: event.pageX - (canvasRef.current?.offsetLeft ?? 0),
          by: event.pageY - (canvasRef.current?.offsetTop ?? 0),
        });
      },
      [
        canvasRef,
        connecting.actionA,
        position.x,
        position.y,
        size.height,
        size.width,
      ]
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
    if (currentLine && !connecting.actionA) {
      setCurrentLine(undefined);
    }
  }, [connecting.actionA, currentLine]);

  return {
    handleCanvasClick,
    updateCurrentLine,
    currentLine,
    currentLineRef,
  };
};
