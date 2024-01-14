"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { hydrationDoneAtom } from "@/state/hydration";

import { Canvas } from "./canvas";
import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";
import { Zoom } from "./zoom";

export const Console: React.FC = () => {
  const [hydrationDone, setHydrationDone] = useRecoilState(hydrationDoneAtom);
  useEffect(() => {
    if (hydrationDone) {
      return;
    }

    setHydrationDone(true);
  }, [hydrationDone, setHydrationDone]);

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <TopBar />

      <div className="grid grid-cols-[auto_1fr] ">
        <SideBar />

        <div className="p-4 bg-gray-100">
          <Canvas />
        </div>
      </div>

      <Zoom />
    </div>
  );
};
