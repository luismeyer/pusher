import { useActionIndexAtom } from "@/state/actionIndexSelector";
import { useDataAtom } from "@/state/data";
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
  const index = useActionIndexAtom(id);

  const [data] = useDataAtom(id);

  return (
    <h3>
      {index}. {TypeLabels[data.type]}
    </h3>
  );
};
