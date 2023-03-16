import { Layout, Menu, MenuProps, theme } from "antd";

import { Canvas } from "@/components/canvas";
import { CodeOutlined } from "@ant-design/icons";

import { useActionsAtom } from "../state/actions";

const { Header, Sider, Content } = Layout;

export default function Console() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [actions, setActions] = useActionsAtom();

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
              onClick: () =>
                setActions([
                  ...actions,
                  {
                    id: Math.floor(Math.random() * 1000).toString(),
                    x: 10,
                    y: 10,
                    data: {
                      type: "click",
                      selector: "",
                    },
                  },
                ]),
            },
            {
              key: "2",
              label: "Wait For",
            },
          ],
        },
      ],
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          items={[{ type: "group", label: <h1>Pusher Console</h1> }]}
        />
      </Header>

      <Layout>
        <Sider width={300} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultOpenKeys={["actions"]}
            style={{ height: "100%" }}
            selectable={false}
            items={items}
          />
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content style={{ background: colorBgContainer }}>
            <Canvas />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
