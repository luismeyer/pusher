import { Menu, MenuProps } from "antd";
import { useMemo } from "react";

import { useAddAction } from "@/state/actions";
import {
  CodeOutlined,
  NodeCollapseOutlined,
  SendOutlined,
} from "@ant-design/icons";

export const SideBar: React.FC = () => {
  const { addAction, id } = useAddAction();

  const items: MenuProps["items"] = useMemo(
    () => [
      {
        icon: <CodeOutlined />,
        label: "Navigation Actions",
        key: "navigation",
        children: [
          {
            key: "1",
            label: "Click",
            onClick: () => addAction({ id, type: "click", selector: "" }),
          },
          {
            key: "2",
            label: "Scroll To Bottom",
            onClick: () => addAction({ id, type: "scrollToBottom" }),
          },
          {
            key: "4",
            label: "Timeout",
            onClick: () => addAction({ id, type: "timeout", timeInSeconds: 0 }),
          },
          {
            key: "5",
            label: "Wait For Element",
            onClick: () => addAction({ id, type: "waitFor", selector: "" }),
          },
          {
            key: "6",
            label: "Open Page",
            onClick: () => addAction({ id, type: "openPage", pageUrl: "" }),
          },
          {
            key: "7",
            label: "Type Text",
            onClick: () =>
              addAction({ id, type: "type", selector: "", text: "" }),
          },
        ],
      },
      {
        icon: <NodeCollapseOutlined />,
        label: "Decision Actions",
        key: "decisions",
        children: [
          {
            key: "8",
            label: "Element Exists",
            onClick: () => addAction({ id, type: "exists", selector: "" }),
          },
          {
            key: "9",
            label: "Text Content Matches",
            onClick: () =>
              addAction({
                id,
                type: "textContentMatches",
                selector: "",
                text: "",
              }),
          },
        ],
      },
      {
        icon: <SendOutlined />,
        label: "Output Actions",
        key: "output",
        children: [
          {
            key: "10",
            label: "Telegram",
            onClick: () =>
              addAction({ id, type: "telegram", chatId: "", message: "" }),
          },
        ],
      },
    ],
    [addAction, id]
  );

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={["navigation", "decisions", "output"]}
      style={{ height: "100%" }}
      selectable={false}
      items={items}
    />
  );
};
