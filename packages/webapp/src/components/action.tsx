import { Button, Card, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { useConnect } from "@/hooks/useConnect";
import { useDeleteAction } from "@/state/actions";
import { dragIdAtom } from "@/state/drag";
import { positionAtom } from "@/state/position";
import { sizeAtom } from "@/state/size";
import styles from "@/styles/action.module.css";
import {
  ApiOutlined,
  DeleteOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";

import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const deleteAction = useDeleteAction(id);

  const [size, setSize] = useRecoilState(sizeAtom(id));

  const position = useRecoilValue(positionAtom(id));

  const ref = useRef<HTMLDivElement>(null);

  const [dragId, setDragId] = useRecoilState(dragIdAtom);

  const {
    connectPreviousAction,
    handleConnectionClick,
    allowConnection,
    isConnecting,
    relation: { nextAction },
    parentAction,
    connectStart,
  } = useConnect(id);

  // effect saves the element height in the atom
  useEffect(() => {
    if (size.height !== ref.current?.clientHeight) {
      setSize((pre) => ({ ...pre, height: ref.current?.clientHeight ?? 0 }));
    }

    if (size.width !== ref.current?.clientWidth) {
      setSize((pre) => ({ ...pre, width: ref.current?.clientWidth ?? 0 }));
    }
  }, [ref, setSize, size.height, size.width]);

  const {
    token: { colorPrimary, colorSuccess },
  } = theme.useToken();

  const handleDeleteClick = useCallback(() => {
    deleteAction();
  }, [deleteAction]);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (allowConnection) {
        connectPreviousAction();
        return;
      }

      // start drag
      if (!isConnecting) {
        setDragId(id);
      }
    }, [allowConnection, connectPreviousAction, id, isConnecting, setDragId]);

  // stop drag
  const handleMouseUp: React.MouseEventHandler<HTMLDivElement> =
    useCallback(() => {
      if (!dragId) {
        return;
      }

      setDragId(undefined);
    }, [dragId, setDragId]);

  const cursor = useMemo(() => {
    if (allowConnection) {
      return "pointer";
    }

    if (isConnecting && !allowConnection) {
      return "not-allowed";
    }

    if (!isConnecting) {
      return "move";
    }
  }, [allowConnection, isConnecting]);

  const borderColor = useMemo(() => {
    if (nextAction || parentAction) {
      return colorPrimary;
    }

    if (isConnecting && connectStart !== id) {
      return colorSuccess;
    }
  }, [
    nextAction,
    parentAction,
    isConnecting,
    connectStart,
    id,
    colorPrimary,
    colorSuccess,
  ]);

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
        zIndex: dragId === id ? "100" : "initial",
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

            <div className={styles.buttons}>
              <Button
                type="dashed"
                shape="round"
                danger={Boolean(nextAction) || connectStart === id}
                disabled={isConnecting}
                onClick={handleConnectionClick}
                icon={nextAction ? <DisconnectOutlined /> : <ApiOutlined />}
              />

              <Button
                type="dashed"
                shape="round"
                danger
                disabled={isConnecting}
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
              />
            </div>
          </div>
        }
      >
        <ActionContent id={id} />
      </Card>
    </div>
  );
};
