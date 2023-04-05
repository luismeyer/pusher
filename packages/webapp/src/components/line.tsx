import { theme } from "antd";
import React, { useCallback, useMemo } from "react";

import { useCancelConnect } from "@/hooks/useCancelConnect";
import { Line as LineData } from "@/state/line";

type LineProps = {
  data: LineData;
};

type Border = "bottomleft" | "bottomright" | "topleft" | "topright";

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
      let border: Border = "bottomleft";

      if (ax < bx) {
        // a is left of b

        if (ay < by) {
          /**
           * #a###
           * #####
           * ###b#
           */
          border = height > width ? "bottomleft" : "topright";
        } else {
          /**
           * ###b#
           * #####
           * #a###
           */
          border = height > width ? "topleft" : "bottomright";
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
          border = height > width ? "bottomright" : "topleft";
        } else {
          /**
           * #b###
           * #####
           * ###a#
           */
          border = height > width ? "topright" : "bottomleft";
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

  const state = useMemo(() => calculateState(data), [calculateState, data]);

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

  const border = `1px solid ${color}`;

  const borderTop = state.border.includes("top") ? border : undefined;

  const borderRight = state.border.includes("right") ? border : undefined;

  const borderLeft = state.border.includes("left") ? border : undefined;

  const borderBottom = state.border.includes("bottom") ? border : undefined;

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
        borderRadius: 10,

        // backgroundColor: "pink",
      }}
    />
  );
};
