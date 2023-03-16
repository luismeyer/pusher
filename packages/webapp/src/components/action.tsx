import { Button, Card } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { useActionIndexAtom } from "@/state/actionIndexSelector";
import { useActionAtom } from "@/state/actionSelector";
import { useConnectingAtom } from "@/state/connecting";
import { usePreviousActionAtom } from "@/state/previousActionSelector";
import styles from "@/styles/action.module.css";
import { ApiOutlined, DisconnectOutlined } from "@ant-design/icons";

import { useConnection } from "../hooks/useConnection";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

type ActionProps = {
  canvas: React.RefObject<HTMLDivElement>;
  id: string;
};

export const Action: React.FC<ActionProps> = ({ id, canvas }) => {
  const [action, setAction] = useActionAtom(id);

  const index = useActionIndexAtom(id);

  const [{ actionA }] = useConnectingAtom();

  const ref = useRef<HTMLDivElement>(null);

  const { dragStart, dragging } = useDragAndDrop(id, ref, canvas);

  const [hovered, setHovered] = useState(false);

  const {
    connectPreviousAction,
    handleConnectionClick,
    allowConnection,
    showConnectionButton,
  } = useConnection(id, hovered);

  // effect saves the element height in the atom
  useEffect(() => {
    if (action.height !== ref.current?.clientHeight) {
      setAction((pre) => ({ ...pre, height: ref.current?.clientHeight }));
    }

    if (action.width !== ref.current?.clientWidth) {
      setAction((pre) => ({ ...pre, width: ref.current?.clientWidth }));
    }
  }, [action.height, action.width, ref, setAction]);

  return (
    <div
      ref={ref}
      onMouseDown={allowConnection ? connectPreviousAction : dragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={styles.container}
      key={id}
      style={{
        top: action.y,
        left: action.x,
        zIndex: dragging ? "100" : "initial",
        cursor: allowConnection ? "pointer" : "move",
      }}
    >
      <Card title={`${index}. Action`} bordered={true} className={styles.card}>
        <p>
          ActionType: <b>{action.data.type}</b>
        </p>
      </Card>

      <div
        className={styles.nextAction}
        style={{
          transform: showConnectionButton ? "translateY(0)" : undefined,
        }}
      >
        <Button
          type="primary"
          danger={Boolean(action.nextAction) || actionA === id}
          shape="circle"
          icon={action.nextAction ? <DisconnectOutlined /> : <ApiOutlined />}
          onClick={handleConnectionClick}
        />
      </div>
    </div>
  );
};
