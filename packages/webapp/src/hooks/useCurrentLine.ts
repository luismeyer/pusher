import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { connectStartAtom, connectTypeAtom } from "@/state/connect";
import { Line } from "@/state/line";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";

export const useCurrentLine = (
  canvasRef: React.RefObject<HTMLDivElement>,
  lines: React.RefObject<HTMLDivElement[]>
) => {
  const [connectStart, setConnectStart] = useRecoilState(connectStartAtom);

  const [position] = useRecoilState(positionAtom(connectStart ?? ""));

  const size = useRecoilValue(sizeAtom(connectStart ?? ""));

  const currentLineRef = useRef<HTMLDivElement>(null);
  const [currentLine, setCurrentLine] = useState<Line | undefined>();

  const lineType = useRecoilValue(connectTypeAtom);

  const updateCurrentLine: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        if (!connectStart) {
          return;
        }

        setCurrentLine({
          ax: position.x + size.width / 2,
          ay: position.y + size.height / 2,
          bx: event.clientX - (canvasRef.current?.offsetLeft ?? 0),
          by: event.clientY - (canvasRef.current?.offsetTop ?? 0),
          type: lineType,
        });
      },
      [
        canvasRef,
        connectStart,
        lineType,
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
          setConnectStart(undefined);
        }
      },
      [canvasRef, currentLine, lines, setConnectStart]
    );

  // Clear the line if connecting canceled or finished
  useEffect(() => {
    if (currentLine && !connectStart) {
      setCurrentLine(undefined);
    }
  }, [connectStart, currentLine]);

  return {
    handleCanvasClick,
    updateCurrentLine,
    currentLine,
    currentLineRef,
  };
};
