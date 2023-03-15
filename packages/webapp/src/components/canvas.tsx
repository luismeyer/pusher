import React, { useRef } from "react";
import { useRecoilValue } from "recoil";

import { actionsAtom } from "@/state/actions";
import styles from "@/styles/canvas.module.css";

import { Action } from "./action";

export const Canvas: React.FC = () => {
  const actions = useRecoilValue(actionsAtom);

  const canvas = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.canvas} ref={canvas}>
      {actions.map((action) => (
        <Action key={action.id} id={action.id} canvas={canvas} />
      ))}
    </div>
  );
};
