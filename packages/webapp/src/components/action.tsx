import { Card, Space, theme } from "antd";
import React, { useEffect, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";

import { useConnect } from "@/hooks/useConnect";
import { useSizeSync } from "@/hooks/useSizeSync";
import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import styles from "@/styles/action.module.css";

import { ActionButtons } from "./actionButton";
import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const position = useRecoilValue(positionAtom(id));

  const ref = useRef<HTMLDivElement>(null);

  useSizeSync(id, ref);

  const {
    connectPreviousAction,
    allowConnect,
    isConnecting,
    relation: { nextAction },
    parentAction,
  } = useConnect(id);

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
      key={id}
      ref={ref}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={styles.action}
      style={{
        position: "absolute",
        borderRadius: 5,
        top: position.y,
        left: position.x,
        cursor,
      }}
    >
      <Card
        hoverable
        style={{
          transition: "border-color 0.5s",
          zIndex: 2,
          borderColor,
          cursor,
        }}
        bordered={true}
        title={
          <Space align="center" size="large">
            <ActionHeader id={id} />

            <ActionButtons id={id} disabled={isConnecting} />
          </Space>
        }
      >
        <ActionContent id={id} />
      </Card>
    </div>
  );
};
