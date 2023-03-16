import React, { useCallback, useEffect, useRef, useState } from "react";

import { useActionsAtom } from "@/state/actions";
import { Line as Points, useLineAtom } from "@/state/lineSelector";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";
import { Line } from "./line";
import { useCurrentLine } from "../hooks/useCurrentLine";

export const Canvas: React.FC = () => {
  const { actions } = useActionsAtom();

  const lines = useLineAtom();

  const canvasRef = useRef<HTMLDivElement>(null);

  const lineRefs = useRef<HTMLDivElement[]>([]);

  const { currentLine, currentLineRef, handleCanvasClick, updateCurrentLine } =
    useCurrentLine(canvasRef, lineRefs);

  return (
    <div
      className={styles.canvas}
      ref={canvasRef}
      onMouseMove={updateCurrentLine}
      onClick={handleCanvasClick}
    >
      {actions.map((action) => (
        <Action key={action.id} id={action.id} canvas={canvasRef} />
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
