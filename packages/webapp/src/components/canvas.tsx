import React, { useCallback, useRef, useState } from "react";
import { useRecoilValue } from "recoil";

import { useCurrentLine } from "@/hooks/useCurrentLine";
import { useDrag } from "@/hooks/useDrag";
import { actionIdsAtom } from "@/state/actions";
import { lineSelector } from "@/state/line";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";
import { Line } from "./line";

type CanvasProps = {
  zoom: number;
};

export const Canvas: React.FC<CanvasProps> = ({ zoom }) => {
  const actionIds = useRecoilValue(actionIdsAtom);

  const lines = useRecoilValue(lineSelector);
  const lineRefs = useRef<HTMLDivElement[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

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
      style={{ zoom }}
    >
      {actionIds.map((id) => (
        <Action key={id} id={id} />
      ))}

      {lines.map((line, index) => (
        <Line
          ref={(ref) => ref && (lineRefs.current[index] = ref)}
          key={index}
          data={line}
        />
      ))}

      {currentLine && <Line ref={currentLineRef} data={currentLine} />}
    </div>
  );
};
