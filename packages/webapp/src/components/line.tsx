import React, { useEffect, useState } from "react";
import { Line as Points } from "@/state/lineSelector";

type LineProps = {
  points: Points;
};

export const Line: React.FC<LineProps> = ({ points }) => {
  const [line, setLine] = useState({ distance: 0, degree: 0, y: 0, x: 0 });

  const calculateLine = ({ ax, ay, bx, by }: Points) => {
    if (ax > bx) {
      bx = ax + bx;
      ax = bx - ax;
      bx = bx - ax;

      by = ay + by;
      ay = by - ay;
      by = by - ay;
    }

    const distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    const calc = Math.atan((by - ay) / (bx - ax));
    const degree = (calc * 180) / Math.PI;

    return { distance, degree, x: ax, y: ay };
  };

  useEffect(() => {
    const newLine = calculateLine(points);

    if (
      newLine.degree === line.degree &&
      newLine.distance === line.distance &&
      newLine.x === line.x &&
      newLine.y === line.y
    ) {
      return;
    }

    setLine(newLine);
  }, [line.degree, line.distance, line.x, line.y, points]);

  return (
    <div
      style={{
        position: "absolute",
        height: "1px",
        transformOrigin: "top left",
        width: line.distance,
        top: line.y + "px",
        left: line.x + "px",
        transform: `rotate(${line.degree}deg)`,
        zIndex: 0,
        borderTop: "2px dotted black",
      }}
    />
  );
};
