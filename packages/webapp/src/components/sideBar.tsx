import { Menu, MenuProps } from "antd";

import { useAddAction } from "@/state/actions";
import {
  CodeOutlined,
  SendOutlined,
  NodeCollapseOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";

export const SideBar: React.FC = () => {
  const addAction = useAddAction();

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
            onClick: () => addAction({ type: "click", selector: "" }),
          },
          {
            key: "2",
            label: "Scroll To Bottom",
            onClick: () => addAction({ type: "scrollToBottom" }),
          },
          {
            key: "4",
            label: "Timeout",
            onClick: () => addAction({ type: "timeout", timeInSeconds: 0 }),
          },
          {
            key: "5",
            label: "Wait For Element",
            onClick: () => addAction({ type: "waitFor", selector: "" }),
          },
          {
            key: "6",
            label: "Open Page",
            onClick: () => addAction({ type: "openPage", pageUrl: "" }),
          },
          {
            key: "7",
            label: "Type Text",
            onClick: () => addAction({ type: "type", selector: "", text: "" }),
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
            onClick: () => addAction({ type: "exists", selector: "" }),
          },
          {
            key: "9",
            label: "Text Content Matches",
            onClick: () =>
              addAction({ type: "textContentMatches", selector: "", text: "" }),
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
              addAction({ type: "telegram", chatId: "", message: "" }),
          },
        ],
      },
    ],
    [addAction]
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
