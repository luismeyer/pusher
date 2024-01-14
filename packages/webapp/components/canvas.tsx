"use client";

import React, { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { useCancelConnect } from "@/hooks/useCancelConnect";
import { useDrag } from "@/hooks/useDrag";
import { useWindowSize } from "@/hooks/useWindowSize";
import { actionIdsAtom } from "@/state/actions";
import { canvasAtom } from "@/state/canvas";
import { zoomAtom } from "@/state/zoom";

import { Action } from "./action";
import { CurrentLine } from "./currentLine";
import { Lines } from "./lines";

export const Canvas: React.FC = () => {
  const zoom = useRecoilValue(zoomAtom);

  const actionIds = useRecoilValue(actionIdsAtom);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDrag = useDrag();

  const cancelConnect = useCancelConnect();

  const setCanvas = useSetRecoilState(canvasAtom);
  const windowSize = useWindowSize();

  // saves the element height in the atom
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    setCanvas({
      width: canvasRef.current.scrollWidth,
      height: canvasRef.current.scrollHeight,
      offSetX: canvasRef.current.offsetLeft,
      offSetY: canvasRef.current.offsetTop,
    });
  }, [setCanvas, windowSize]);

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleDrag}
      onClick={cancelConnect}
      className="relative overflow-scroll h-full bg-white rounded-lg"
      style={{
        transform: `scale(${zoom}) translate(calc(50% - 50% / ${zoom}), calc(50% - 50% / ${zoom}))`,
        width: `calc(100% / ${zoom})`,
        height: `calc(100% / ${zoom})`,
      }}
    >
      {actionIds.map((id) => (
        <Action key={id} id={id} />
      ))}

      {actionIds.map((id) => (
        <Lines key={id} actionId={id} />
      ))}

      <CurrentLine />
    </div>
  );
};
