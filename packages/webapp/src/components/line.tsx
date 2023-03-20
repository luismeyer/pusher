import { theme } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Line as LineData } from "@/state/line";
import { useCancelConnect } from "../hooks/useCancelConnect";

type LineProps = {
  data: LineData;
};

type Border = "bottomLeft" | "bottomRight" | "topLeft" | "topRight";

type State = {
  width: number;
  height: number;
  y: number;
  x: number;
  border: Border;
};

export const Line: React.FC<LineProps> = ({ data }) => {
  const {
    token: { colorPrimary, colorSuccess, colorError },
  } = theme.useToken();

  const calculateBorder = useCallback(
    ({ ax, ay, bx, by }: LineData, width: number, height: number) => {
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
    (line: LineData): State => {
      const { ax, ay, bx, by } = line;

      const width = Math.abs(bx - ax);
      const height = Math.abs(by - ay);

      return {
        width,
        height,
        x: Math.min(ax, bx),
        y: Math.min(ay, by),
        border: calculateBorder(line, width, height),
      };
    },
    [calculateBorder]
  );

  const [state, setState] = useState<State>(calculateState(data));

  useEffect(() => {
    const newState = calculateState(data);
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
  }, [calculateState, data, state]);

  const color = useMemo(() => {
    switch (data.type) {
      case "default":
        return colorPrimary;
      case "false":
        return colorError;
      case "true":
        return colorSuccess;
    }
  }, [colorError, colorPrimary, colorSuccess, data.type]);

  const border = `2px dashed ${color}`;

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

  const cancelConnect = useCancelConnect();

  return (
    <div
      onClick={cancelConnect}
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
};
