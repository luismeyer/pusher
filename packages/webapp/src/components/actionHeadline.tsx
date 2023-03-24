import { Space, Typography } from "antd";
import { useRecoilValue } from "recoil";

import { dataAtom } from "@/state/data";
import { actionIndexSelector } from "@/state/relation";
import styles from "@/styles/action.module.css";
import { Action } from "@pusher/shared";

type ActionHeaderProps = {
  id: string;
};

const TypeLabels: Record<Action["type"], string> = {
  click: "Click Element",
  type: "Type",
  exists: "Exists",
  openPage: "Open Page",
  waitFor: "Wait For Element",
  scrollToBottom: "Scroll To Bottom",
  telegram: "Telegram",
  textContentMatches: "Text Content Matches",
  timeout: "Timeout",
};

export const ActionHeader: React.FC<ActionHeaderProps> = ({ id }) => {
  const index = useRecoilValue(actionIndexSelector(id));

  const data = useRecoilValue(dataAtom(id));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>
        {index}. {TypeLabels[data.type]}
      </h3>

      <span
        style={{
          fontSize: "8px",
          fontWeight: "lighter",
        }}
      >
        {id}
      </span>
    </div>
  );
};
