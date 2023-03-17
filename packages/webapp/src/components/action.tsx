import { Button, Card, theme } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { useConnectingAtom } from "@/state/connecting";
import styles from "@/styles/action.module.css";
import {
  ApiOutlined,
  DisconnectOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useConnection } from "../hooks/useConnection";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { useActionAtom } from "../state/actionSelector";
import { useDeleteAction } from "../state/actions";
import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";

type ActionProps = {
  canvas: React.RefObject<HTMLDivElement>;
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id, canvas }) => {
  const deleteAction = useDeleteAction();

  const [action, setAction] = useActionAtom(id);

  const [{ actionA }] = useConnectingAtom();

  const ref = useRef<HTMLDivElement>(null);

  const { dragStart, dragging } = useDragAndDrop(id, ref, canvas);

  const {
    connectPreviousAction,
    handleConnectionClick,
    allowConnection,
    previousAction,
    isConnecting,
  } = useConnection(id);

  // effect saves the element height in the atom
  useEffect(() => {
    if (action.height !== ref.current?.clientHeight) {
      setAction((pre) => ({ ...pre, height: ref.current?.clientHeight }));
    }

    if (action.width !== ref.current?.clientWidth) {
      setAction((pre) => ({ ...pre, width: ref.current?.clientWidth }));
    }
  }, [action.height, action.width, ref, setAction]);

  const {
    token: { colorPrimary, colorSuccess },
  } = theme.useToken();

  const handleDeleteClick = useCallback(() => {
    deleteAction(action);
  }, [action, deleteAction]);

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (allowConnection) {
        connectPreviousAction();
        return;
      }

      if (!isConnecting) {
        dragStart(event);
      }
    },
    [allowConnection, connectPreviousAction, dragStart, isConnecting]
  );

  const cursor = useMemo(() => {
    if (allowConnection) {
      return "pointer";
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
      className={styles.container}
      key={id}
      style={{
        top: action.y,
        left: action.x,
        zIndex: dragging ? "100" : "initial",
        cursor,
      }}
    >
      <Card
        style={{
          transition: "border-color 0.5s",
          borderColor,
        }}
        title={
          <div className={styles.header}>
            <ActionHeader id={id} />

            <div className={styles.buttons}>
              <Button
                type="dashed"
                shape="round"
                danger={Boolean(action.nextAction) || actionA === id}
                disabled={isConnecting}
                icon={
                  action.nextAction ? <DisconnectOutlined /> : <ApiOutlined />
                }
                onClick={handleConnectionClick}
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
        bordered={true}
        className={styles.card}
      >
        <ActionContent id={id} />
      </Card>
    </div>
  );
};
