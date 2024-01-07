"use client";

import { Menu, MenuProps } from "antd";
import { useMemo } from "react";

import { useAddAction } from "../state/actions";
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
            key: "click",
            label: "Click",
            onClick: () => addAction({ id, type: "click", selector: "" }),
          },
          {
            key: "scroll",
            label: "Scroll To Bottom",
            onClick: () => addAction({ id, type: "scrollToBottom" }),
          },
          {
            key: "timeout",
            label: "Timeout",
            onClick: () => addAction({ id, type: "timeout", timeInSeconds: 0 }),
          },
          {
            key: "wait",
            label: "Wait For Element",
            onClick: () => addAction({ id, type: "waitFor", selector: "" }),
          },
          {
            key: "open",
            label: "Open Page",
            onClick: () => addAction({ id, type: "openPage", pageUrl: "" }),
          },
          {
            key: "type",
            label: "Type Text",
            onClick: () =>
              addAction({ id, type: "type", selector: "", text: "" }),
          },
          {
            key: "store",
            label: "Store Text Content",
            onClick: () =>
              addAction({
                id,
                type: "storeTextContent",
                selector: "",
                variableName: "",
              }),
          },
          {
            key: "keyboard",
            label: "Keyboard Input",
            onClick: () =>
              addAction({
                id,
                type: "keyboard",
                key: "Enter",
              }),
          },
        ],
      },
      {
        icon: <NodeCollapseOutlined />,
        label: "Decision Actions",
        key: "decisions",
        children: [
          {
            key: "exists",
            label: "Element Exists",
            onClick: () => addAction({ id, type: "exists", selector: "" }),
          },
          {
            key: "contetnMatches",
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
            key: "11",
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
