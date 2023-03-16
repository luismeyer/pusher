import { Layout, theme } from "antd";

import { Canvas } from "@/components/canvas";
import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";

const { Header, Sider, Content } = Layout;

export default function Console() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header>
        <TopBar />
      </Header>

      <Layout>
        <Sider width={300} style={{ background: colorBgContainer }}>
          <SideBar />
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
