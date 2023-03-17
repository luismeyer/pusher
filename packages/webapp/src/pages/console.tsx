import { Layout, theme } from "antd";
import dynamic from "next/dynamic";

import { SideBar } from "@/components/sideBar";
import { TopBar } from "@/components/topBar";

const Canvas = dynamic(
  import("@/components/canvas").then((i) => i.Canvas),
  { ssr: false }
);

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
