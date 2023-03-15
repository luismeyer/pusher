import { Button, Card } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { useActionAtom } from "@/state/actionSelector";
import styles from "@/styles/action.module.css";
import { ApiOutlined, DisconnectOutlined } from "@ant-design/icons";

import { useDragAndDrop } from "../hooks/useDragAndDrop";
import { connectingAtom } from "../state/connecting";

type ActionProps = {
  canvas: React.RefObject<HTMLDivElement>;
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id, canvas }) => {
  const [action, setAction] = useActionAtom(id);

  const [connecting, setConnecting] = useRecoilState(connectingAtom);

  const ref = useRef<HTMLDivElement>(null);

  const { dragStart, dragging } = useDragAndDrop(id, ref, canvas);

  const [hovered, setHovered] = useState(false);

  const handleConnection = useCallback(() => {
    // unconnect
    if (action.nextAction) {
      setAction((prev) => ({ ...prev, nextAction: undefined }));
      return;
    }

    // start connection
    if (!connecting.actionA) {
      setConnecting({ actionA: id });
      return;
    }

    // cancel connection
    if (connecting.actionA === id) {
      setConnecting({});
      return;
    }

    // end connection
    setConnecting((prev) => ({
      ...prev,
      actionB: id,
    }));
  }, [action.nextAction, connecting.actionA, id, setAction, setConnecting]);

  const [line, setLine] = useState({ distance: 0, degree: 0, ay: 0, ax: 0 });

  const lineDraw = (ax: number, ay: number, bx: number, by: number) => {
    if (ax > bx) {
      bx = ax + bx;
      ax = bx - ax;
      bx = bx - ax;

      by = ay + by;
      ay = by - ay;
      by = by - ay;
    }

    const distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
    const calc = Math.atan((by - ay) / (bx - ax));
    const degree = (calc * 180) / Math.PI;

    setLine({ distance, degree, ax, ay });
  };

  useEffect(() => {
    if (connecting.actionA !== id || !connecting.actionB) {
      return;
    }

    setAction((prev) => ({ ...prev, nextAction: connecting.actionB }));
    setConnecting({});
  }, [
    action,
    connecting.actionA,
    connecting.actionB,
    id,
    setAction,
    setConnecting,
  ]);

  const connectable = hovered || (!action.nextAction && connecting.actionA);

  return (
    <div
      ref={ref}
      onMouseDown={dragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={styles.container}
      key={id}
      style={{
        top: action.y,
        left: action.x,
        zIndex: dragging ? "100" : "initial",
      }}
    >
      <Card title={id} bordered={true} className={styles.card}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>

      <div
        className={`${styles.nextAction} ${connectable ? styles.visible : ""}`}
      >
        <Button
          type="primary"
          danger={Boolean(action.nextAction) || connecting.actionA === id}
          shape="circle"
          icon={action.nextAction ? <DisconnectOutlined /> : <ApiOutlined />}
          onClick={handleConnection}
        />
      </div>

      <div
        style={{
          position: "absolute",
          height: "1px",
          transformOrigin: "top left",
          width: line.distance,
          top: line.ay + "px",
          left: line.ax + "px",
          transform: `rotate(${line.degree}deg)`,
          backgroundColor: "back",
        }}
      ></div>
    </div>
  );
};
