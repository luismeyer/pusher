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
import { useActionAtom } from "../state/actionSelector";
import { useDeleteAction } from "../state/actions";
import { ActionContent } from "./actionContent";
import { ActionHeader } from "./actionHeadline";
import { useDragIdAtom } from "../state/drag";

type ActionProps = {
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id }) => {
  const deleteAction = useDeleteAction();

  const [action, setAction] = useActionAtom(id);

  const [{ actionA }] = useConnectingAtom();

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
        top: action.y,
        left: action.x,
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
