"use client";

import { useRecoilValue } from "recoil";

import { dataAtom } from "@/state/data";
import { actionIndexSelector } from "@/state/relation";
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
  storeTextContent: "Store Text Content in Variable",
  keyboard: "Keyboard Strokes",
};

export const ActionHeader: React.FC<ActionHeaderProps> = ({ id }) => {
  const index = useRecoilValue(actionIndexSelector(id));

  const data = useRecoilValue(dataAtom(id));

  return (
    <div className="flex flex-col">
      <h3 className="text-lg">
        {index}. {TypeLabels[data.type]}
      </h3>

      <span className="text-xs font-light">{id}</span>
    </div>
  );
};
