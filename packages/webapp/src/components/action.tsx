import { Button, Card, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { useConnectingAtom } from "@/state/connecting";
import { usePositionAtom } from "@/state/position";
import { useSizeAtom } from "@/state/size";
import styles from "@/styles/action.module.css";
import {
  ApiOutlined,
  DeleteOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";

import { useConnection } from "../hooks/useConnection";
import { useDeleteAction } from "../state/actions";
import { useActionAtom } from "../state/actionSelector";
import { useDragIdAtom } from "../state/drag";
import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const deleteAction = useDeleteAction(id);

  const [action, setAction] = useActionAtom(id);

  const [{ actionA }] = useConnectingAtom();

  const [size, setSize] = useSizeAtom(id);

  const [position] = usePositionAtom(id);

  const ref = useRef<HTMLDivElement>(null);

  const [dragId, setDragId] = useDragIdAtom();

  const {
    connectPreviousAction,
    handleConnectionClick,
    allowConnection,
    previousAction,
    isConnecting,
  } = useConnection(id);

  // effect saves the element height in the atom
  useEffect(() => {
    if (size.height !== ref.current?.clientHeight) {
      setSize((pre) => ({ ...pre, height: ref.current?.clientHeight ?? 0 }));
    }

    if (size.width !== ref.current?.clientWidth) {
      setSize((pre) => ({ ...pre, width: ref.current?.clientWidth ?? 0 }));
    }
  }, [ref, setAction, setSize, size.height, size.width]);

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
    if (action.nextAction || previousAction) {
      return colorPrimary;
    }

    if (isConnecting && actionA !== id) {
      return colorSuccess;
    }
  }, [
    action.nextAction,
    actionA,
    colorPrimary,
    colorSuccess,
    id,
    isConnecting,
    previousAction,
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
                danger={Boolean(action.nextAction) || actionA === id}
                disabled={isConnecting}
                onClick={handleConnectionClick}
                icon={
                  action.nextAction ? <DisconnectOutlined /> : <ApiOutlined />
                }
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
