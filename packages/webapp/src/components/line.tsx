import { theme } from "antd";
import React, { forwardRef, useCallback, useEffect, useState } from "react";

import { Line as Points } from "@/state/line";

type LineProps = {
  points: Points;
};

type Border = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

type State = {
  width: number;
  height: number;
  y: number;
  x: number;
  border: Border;
};

export const Line = forwardRef<HTMLDivElement, LineProps>(({ points }, ref) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  const calculateBorder = useCallback(
    ({ ax, ay, bx, by }: Points, width: number, height: number) => {
      let border: Border = "bottomLeft";

      if (ax < bx) {
        // a is left of b

        if (ay < by) {
          /**
           * #a###
           * #####
           * ###b#
           */
          border = height > width ? "bottomLeft" : "topRight";
        } else {
          /**
           * ###b#
           * #####
           * #a###
           */
          border = height > width ? "topLeft" : "bottomRight";
        }
      }

      if (ax > bx) {
        // a is right of b

        if (ay < by) {
          /**
           * ###a#
           * #####
           * #b###
           */
          border = height > width ? "bottomRight" : "topLeft";
        } else {
          /**
           * #b###
           * #####
           * ###a#
           */
          border = height > width ? "topRight" : "bottomLeft";
        }
      }

      return border;
    },
    []
  );

  const calculateState = useCallback(
    (points: Points): State => {
      const { ax, ay, bx, by } = points;

      const width = Math.abs(bx - ax);
      const height = Math.abs(by - ay);

      return {
        width,
        height,
        x: Math.min(ax, bx),
        y: Math.min(ay, by),
        border: calculateBorder(points, width, height),
      };
    },
    [calculateBorder]
  );

  const [state, setState] = useState<State>(calculateState(points));

  useEffect(() => {
    const newState = calculateState(points);
    const { width, height, x, y, border } = state;

    if (
      newState.width === width &&
      newState.height === height &&
      newState.x === x &&
      newState.y === y &&
      newState.border === border
    ) {
      return;
    }

    setState(newState);
  }, [calculateState, points, state]);

  const border = `2px dashed ${colorPrimary}`;

  const borderTop =
    state.border === "topRight" || state.border === "topLeft"
      ? border
      : undefined;

  const borderRight =
    state.border === "topRight" || state.border === "bottomRight"
      ? border
      : undefined;

  const borderLeft =
    state.border === "topLeft" || state.border === "bottomLeft"
      ? border
      : undefined;

  const borderBottom =
    state.border === "bottomLeft" || state.border === "bottomRight"
      ? border
      : undefined;

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        transformOrigin: "top left",
        height: state.height,
        width: state.width,
        top: state.y + "px",
        left: state.x + "px",
        zIndex: 0,
        borderTop,
        borderRight,
        borderBottom,
        borderLeft,

        // backgroundColor: "pink",
      }}
    />
  );
});

Line.displayName = "Line";
