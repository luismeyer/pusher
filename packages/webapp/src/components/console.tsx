import { FloatButton, Layout, theme } from "antd";
import dynamic from "next/dynamic";
import { useState } from "react";

import { SideBar } from "@/components/sideBar";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

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

  const [zoom, setZoom] = useState(1);

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
            <Canvas zoom={zoom} />

            <FloatButton.Group shape="square" style={{ right: 35, bottom: 35 }}>
              <FloatButton
                icon={<PlusOutlined />}
                onClick={() => setZoom((pre) => pre + 0.1)}
              />
              <FloatButton
                icon={<MinusOutlined />}
                onClick={() => setZoom((pre) => pre - 0.1)}
              />
            </FloatButton.Group>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
