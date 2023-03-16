import React, { useCallback, useEffect, useRef, useState } from "react";

import { useActionsAtom } from "@/state/actions";
import { Line as Points, useLineAtom } from "@/state/lineSelector";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";
import { Line } from "./line";
import { useConnectingAtom } from "../state/connecting";
import { useNullableActionAtom } from "../state/nullableActionSelector";

export const Canvas: React.FC = () => {
  const [actions] = useActionsAtom();

  const lines = useLineAtom();

  const canvas = useRef<HTMLDivElement>(null);

  const [connecting, setConnecting] = useConnectingAtom();
  const actionA = useNullableActionAtom(connecting.actionA);
  const [currentLine, setCurrentLine] = useState<Points | undefined>();

  const updateCurrentLine: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        if (!actionA || !actionA.width || !actionA.height) {
          return;
        }

        setCurrentLine({
          ax: actionA.x + actionA.width / 2,
          ay: actionA.y + actionA.height / 2,
          bx: event.pageX - (canvas.current?.offsetLeft ?? 0) + 5,
          by: event.pageY - (canvas.current?.offsetTop ?? 0) + 5,
        });
      },
      [actionA]
    );

  const handleCanvasClick: React.MouseEventHandler<HTMLDivElement> =
    useCallback(
      (event) => {
        if (event.target !== canvas.current) {
          return;
        }

        setConnecting({});
      },
      [setConnecting]
    );

  useEffect(() => {
    if (currentLine && !actionA) {
      console.log("clear");
      setCurrentLine(undefined);
    }
  }, [actionA, currentLine]);

  return (
    <div
      className={styles.canvas}
      ref={canvas}
      onMouseMove={updateCurrentLine}
      onClick={handleCanvasClick}
    >
      {actions.map((action) => (
        <Action key={action.id} id={action.id} canvas={canvas} />
      ))}

      {lines.map((line, index) => (
        <Line key={index} points={line} />
      ))}

      {currentLine && <Line points={currentLine} />}
    </div>
  );
};
