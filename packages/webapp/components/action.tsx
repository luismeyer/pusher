"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";

import { useConnect } from "@/hooks/useConnect";
import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";
import { zoomAtom } from "@/state/zoom";

import { ActionButtons } from "./actionButton";
import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";
import { Card, CardContent, CardHeader } from "./ui/card";
import clsx from "clsx";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const zoom = useRecoilValue(zoomAtom);

  const position = useRecoilValue(positionAtom(id));

  const ref = useRef<HTMLDivElement>(null);

  const [size, setSize] = useRecoilState(sizeAtom(id));

  // saves the element height in the atom
  useEffect(() => {
    const { height = 0, width = 0 } =
      ref.current?.getBoundingClientRect() ?? {};

    if (size.height !== height) {
      setSize((pre) => ({ ...pre, height }));
    }

    if (size.width !== width) {
      setSize((pre) => ({ ...pre, width }));
    }
  }, [ref, setSize, size.height, size.width, zoom]);

  const {
    connectPreviousAction,
    allowConnect,
    isConnecting,
    relation: { nextAction },
    parentAction,
  } = useConnect(id);

  // start drag or connect
  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
    useRecoilCallback(
      ({ set }) =>
        () => {
          if (allowConnect) {
            connectPreviousAction();
            return;
          }

          // start drag
          if (!isConnecting) {
            set(dragIdAtom, id);
          }
        },
      [allowConnect, connectPreviousAction, id, isConnecting]
    );

  // stop drag
  const stopDrag = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const dragId = await snapshot.getPromise(dragIdAtom);

        if (!dragId) {
          return;
        }

        set(dragIdAtom, undefined);
      },
    []
  );

  const cursor = useMemo(() => {
    if (allowConnect) {
      return "pointer";
    }

    if (isConnecting && !allowConnect) {
      return "not-allowed";
    }

    if (!isConnecting) {
      return "move";
    }
  }, [allowConnect, isConnecting]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      stopDrag();
    },
    [stopDrag]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return (
    <Card
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={stopDrag}
      className={clsx("z-10 hover:z-20 absolute rounded-md hover:shadow-lg", {
        "border-blue-600": nextAction || parentAction,
      })}
      style={{ top: position.y, left: position.x, cursor }}
    >
      <CardHeader className="flex flex-row gap-4">
        <ActionHeader id={id} />

        <ActionButtons id={id} disabled={isConnecting} />
      </CardHeader>

      <CardContent>
        <ActionContent id={id} />
      </CardContent>
    </Card>
  );
};
