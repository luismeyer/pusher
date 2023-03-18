import React, { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";

import { useCurrentLine } from "@/hooks/useCurrentLine";
import { useDrag } from "@/hooks/useDrag";
import { actionIdsAtom } from "@/state/actions";
import { lineSelector } from "@/state/line";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";
import { Line } from "./line";

export const Canvas: React.FC = () => {
  const actionIds = useRecoilValue(actionIdsAtom);

  const lines = useRecoilValue(lineSelector);

  const canvasRef = useRef<HTMLDivElement>(null);

  const lineRefs = useRef<HTMLDivElement[]>([]);

  const handleDrag = useDrag(canvasRef);

  const { currentLine, currentLineRef, handleCanvasClick, updateCurrentLine } =
    useCurrentLine(canvasRef, lineRefs);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      handleDrag(event);

      updateCurrentLine(event);
    },
    [handleDrag, updateCurrentLine]
  );

  return (
    <div
      className={styles.canvas}
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
    >
      {actionIds.map((id) => (
        <Action key={id} id={id} />
      ))}

      {lines.map((line, index) => (
        <Line
          ref={(ref) => ref && (lineRefs.current[index] = ref)}
          key={index}
          points={line}
        />
      ))}

      {currentLine && <Line ref={currentLineRef} points={currentLine} />}
    </div>
  );
};
