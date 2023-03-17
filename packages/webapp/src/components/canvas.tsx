import React, { useCallback, useRef } from "react";

import { useActionsAtom } from "@/state/actions";
import { useLineAtom } from "@/state/lineSelector";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";
import { Line } from "./line";
import { useCurrentLine } from "../hooks/useCurrentLine";
import { useDrag } from "../hooks/useDrag";

export const Canvas: React.FC = () => {
  const { actions } = useActionsAtom();

  const lines = useLineAtom();

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
      {actions.map((action) => (
        <Action key={action.id} id={action.id} />
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
