import React, { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";

import { useDrag } from "@/hooks/useDrag";
import { actionIdsAtom } from "@/state/actions";
import styles from "@/styles/canvas.module.css";

import { useCancelConnect } from "../hooks/useCancelConnect";
import { Action } from "./action";
import { CurrentLine } from "./currentLine";
import { Lines } from "./lines";

type CanvasProps = {
  zoom: number;
};

export const Canvas: React.FC<CanvasProps> = ({ zoom }) => {
  const actionIds = useRecoilValue(actionIdsAtom);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrag = useDrag(canvasRef);

  const cancelConnect = useCancelConnect();

  return (
    <div
      className={styles.canvas}
      ref={canvasRef}
      onMouseMove={handleDrag}
      onClick={cancelConnect}
      style={{ zoom }}
    >
      {actionIds.map((id) => (
        <Action key={id} id={id} />
      ))}

      {actionIds.map((id) => (
        <Lines key={id} actionId={id} />
      ))}

      <CurrentLine canvas={canvasRef} />
    </div>
  );
};
