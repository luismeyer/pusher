import React, { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { useCancelConnect } from "@/hooks/useCancelConnect";
import { useDrag } from "@/hooks/useDrag";
import { useWindowSize } from "@/hooks/useWindowSize";
import { actionIdsAtom } from "@/state/actions";
import { canvasAtom } from "@/state/canvas";

import { Action } from "./action";
import { CurrentLine } from "./currentLine";
import { Lines } from "./lines";

export const Canvas: React.FC = () => {
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
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "scroll",
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
