"use client";

import React from "react";
import { RecoilRoot } from "recoil";

import { flowAtom, storeFlow } from "@/state/flow";
import { Flow } from "@pusher/shared";
import { Actions } from "./actions";
import { TopBar } from "./top-bar";
import { Zoom } from "./zoom";

type CanvasProps = {
  flow?: Flow;
  id: string;
};

export const Canvas: React.FC<CanvasProps> = ({ flow, id }) => {
  return (
    <RecoilRoot
      initializeState={(snapshot) => {
        if (!flow) {
          snapshot.set(flowAtom, (pre) => ({ ...pre, id }));

          return;
        }

        storeFlow(flow, snapshot.set);
      }}
    >
      <TopBar />

      <Actions />

      <Zoom />
    </RecoilRoot>
  );
};
