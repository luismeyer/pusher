import { Layout, theme } from "antd";
import dynamic from "next/dynamic";

import { SideBar } from "@/components/sideBar";
import { Zoom } from "./zoom";

const Canvas = dynamic(
  import("@/components/canvas").then((i) => i.Canvas),
  { ssr: false }
);

const TopBar = dynamic(
  import("@/components/topBar").then((i) => i.TopBar),
  { ssr: false }
);

const { Header, Sider, Content } = Layout;

export const Console: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ height: "auto", backgroundColor: "#072448" }}>
        <TopBar />
      </Header>

      <Layout>
        <Sider width={300} style={{ background: colorBgContainer }}>
          <SideBar />
        </Sider>

        <Layout style={{ padding: "24px" }}>
          <Content style={{ background: colorBgContainer }}>
            <Canvas />

            <Zoom />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
