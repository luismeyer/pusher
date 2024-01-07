"use client";

import { Button, Layout } from "antd";

import { GithubOutlined } from "@ant-design/icons";

const { Footer: AntdFooter } = Layout;

export const Footer: React.FC = () => {
  return (
    <AntdFooter style={{ display: "flex", justifyContent: "center" }}>
      <Button
        style={{ fontSize: 16 }}
        icon={<GithubOutlined />}
        type="link"
        href="https://github.com/luismeyer/pusher"
        target="_blank"
      >
        Repository
      </Button>
    </AntdFooter>
  );
};
