"use client";

import { Button, Layout, Space } from "antd";
const { Footer } = Layout;

import { HowItWorks } from "../components/howItWorks";
import { Stage } from "../components/stage";
import { GithubOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <main>
      <Space direction="vertical" size={128}>
        <Stage />

        <HowItWorks />

        <Footer style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{ fontSize: 16 }}
            icon={<GithubOutlined />}
            type="link"
            href="https://github.com/luismeyer/pusher"
            target="_blank"
          >
            Repository
          </Button>
        </Footer>
      </Space>
    </main>
  );
}
