import { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";

import { canvasAtom } from "@/state/canvas";
import { connectStartAtom, connectTypeAtom } from "@/state/connect";
import { Line as LineData } from "@/state/line";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";
import { zoomAtom } from "@/state/zoom";

import { Line } from "./line";

export const CurrentLine: React.FC = () => {
  const [currentLine, setCurrentLine] = useState<LineData | undefined>();

  const connectStart = useRecoilValue(connectStartAtom);

  const updateCurrentLine = useRecoilCallback(
    ({ snapshot }) =>
      async (event: MouseEvent) => {
        const connectStart = await snapshot.getPromise(connectStartAtom);

        if (!connectStart) {
          return;
        }

        const size = await snapshot.getPromise(sizeAtom(connectStart));

        const position = await snapshot.getPromise(positionAtom(connectStart));

        const type = await snapshot.getPromise(connectTypeAtom);

        const canvas = await snapshot.getPromise(canvasAtom);

        const zoom = await snapshot.getPromise(zoomAtom);

        setCurrentLine({
          ax: position.x + size.width / 2 / zoom,
          ay: position.y + size.height / 2 / zoom,
          bx: (event.clientX - canvas.offSetX) / zoom,
          by: (event.clientY - canvas.offSetY) / zoom,
          type,
        });
      },
    [setCurrentLine]
  );

  useEffect(() => {
    // clear current line
    if (currentLine && !connectStart) {
      setCurrentLine(undefined);
    }
  }, [connectStart, currentLine]);

  useEffect(() => {
    document.addEventListener("mousemove", updateCurrentLine);

    return () => {
      document.removeEventListener("mousemove", updateCurrentLine);
    };
  }, [updateCurrentLine]);

  return currentLine ? <Line data={currentLine} /> : null;
};
