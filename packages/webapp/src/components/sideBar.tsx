import { Menu, MenuProps } from "antd";

import { useActionsAtom } from "@/state/actions";
import { CodeOutlined } from "@ant-design/icons";

export const SideBar: React.FC = () => {
  const { addAction } = useActionsAtom();

  const items: MenuProps["items"] = [
    {
      icon: <CodeOutlined />,
      label: "Actions",
      key: "actions",
      children: [
        {
          key: "selector",
          label: "With Selector",
          type: "group",
          children: [
            {
              key: "1",
              label: "Click",
              onClick: () => addAction({ type: "click", selector: "" }),
            },
            {
              key: "2",
              label: "Wait For",
              onClick: () => addAction({ type: "waitFor", selector: "" }),
            },
          ],
        },
      ],
    },
  ];

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={["actions"]}
      style={{ height: "100%" }}
      selectable={false}
      items={items}
    />
  );
};
