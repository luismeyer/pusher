"use client";

import React from "react";
import { useRecoilState } from "recoil";

import { zoomAtom } from "@/state/zoom";
import { Button } from "./ui/button";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "lucide-react";

export const Zoom: React.FC = () => {
  const [zoom, setZoom] = useRecoilState(zoomAtom);

  return (
    <>
      <div className="fixed grid" style={{ right: 35, bottom: 35 }}>
        {zoom !== 1 && (
          <Button
            className="text-[10px] p-0 rounded-b-none"
            onClick={() => setZoom(1)}
          >
            {(zoom * 100).toFixed()}%
          </Button>
        )}

        <Button
          className={clsx("rounded-none", { "rounded-t": zoom === 1 })}
          size="icon"
          onClick={() => setZoom((pre) => pre + 0.1)}
        >
          <PlusIcon />
        </Button>

        <Button
          className="rounded-t-none"
          size="icon"
          onClick={() => setZoom((pre) => pre - 0.1)}
        >
          <MinusIcon />
        </Button>
      </div>
    </>
  );
};
