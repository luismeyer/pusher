"use client";

import { hydrationDoneAtom } from "@/state/hydration";
import { Layout, theme } from "antd";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Canvas } from "./canvas";

import { SideBar } from "./sideBar";
import { TopBar } from "./topBar";
import { Zoom } from "./zoom";

const { Header, Sider, Content } = Layout;

export const Console: React.FC = () => {
  const [hydrationDone, setHydrationDone] = useRecoilState(hydrationDoneAtom);
  useEffect(() => {
    if (hydrationDone) {
      return;
    }

    setHydrationDone(true);
  }, [hydrationDone, setHydrationDone]);

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
