import { Card, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";

import { useConnect } from "@/hooks/useConnect";
import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";
import styles from "@/styles/action.module.css";

import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";
import { ActionButtons } from "./actionButton";
import { useActionCleanup } from "../hooks/useActionCleanup";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const [size, setSize] = useRecoilState(sizeAtom(id));

  const position = useRecoilValue(positionAtom(id));

  const ref = useRef<HTMLDivElement>(null);

  useActionCleanup(id);

  const {
    connectPreviousAction,
    allowConnect,
    isConnecting,
    relation: { nextAction },
    parentAction,
  } = useConnect(id);

  // saves the element height in the atom
  useEffect(() => {
    if (size.height !== ref.current?.clientHeight) {
      setSize((pre) => ({ ...pre, height: ref.current?.clientHeight ?? 0 }));
    }

    if (size.width !== ref.current?.clientWidth) {
      setSize((pre) => ({ ...pre, width: ref.current?.clientWidth ?? 0 }));
    }
  }, [ref, setSize, size.height, size.width]);

  const {
    token: { colorPrimary },
  } = theme.useToken();

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
  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> =
    useRecoilCallback(
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

  const borderColor = useMemo(() => {
    if (nextAction || parentAction) {
      return colorPrimary;
    }
  }, [nextAction, parentAction, colorPrimary]);

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={styles.container}
      key={id}
      style={{
        top: position.y,
        left: position.x,
        // zIndex: dragId === id ? "100" : "initial",
        cursor,
      }}
    >
      <Card
        style={{ transition: "border-color 0.5s", borderColor }}
        bordered={true}
        className={styles.card}
        title={
          <div className={styles.header}>
            <ActionHeader id={id} />

            <ActionButtons id={id} disabled={isConnecting} />
          </div>
        }
      >
        <ActionContent id={id} />
      </Card>
    </div>
  );
};
