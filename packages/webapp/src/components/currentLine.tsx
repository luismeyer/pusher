import { useEffect, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import {
  connectEndAtom,
  connectStartAtom,
  connectTypeAtom,
} from "../state/connect";

import { Line as LineData } from "../state/line";
import { positionAtom } from "../state/position";
import { sizeAtom } from "../state/size";
import { Line } from "./line";

type CurrentLineProps = {
  canvas: React.RefObject<HTMLDivElement>;
};

export const CurrentLine: React.FC<CurrentLineProps> = ({ canvas }) => {
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

        setCurrentLine({
          ax: position.x + size.width / 2,
          ay: position.y + size.height / 2,
          bx: event.clientX - (canvas.current?.offsetLeft ?? 0),
          by: event.clientY - (canvas.current?.offsetTop ?? 0),
          type,
        });
      },
    [canvas.current, setCurrentLine]
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
