"use client";

import React from "react";
import { useRecoilValue } from "recoil";

import { lineSelector } from "@/state/line";

import { Line } from "./line";

type LineProps = {
  actionId: string;
};

export const Lines: React.FC<LineProps> = ({ actionId }) => {
  const lines = useRecoilValue(lineSelector(actionId));

  return (
    <>
      {lines.map((line, index) => (
        <Line key={`${actionId}-${index}`} data={line} />
      ))}
    </>
  );
};
