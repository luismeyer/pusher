import { Button, Layout, Space } from "antd";
import Head from "next/head";

import { HowItWorks } from "@/components/howItWorks";
import { Stage } from "@/components/stage";
import { GithubOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <>
      <Head>
        <title>PHR</title>
        <meta name="description" content="Welcome to Pusher" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Space direction="vertical" size={128}>
          <Stage />

          <HowItWorks />

          <Layout.Footer style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{ fontSize: 16 }}
              icon={<GithubOutlined />}
              type="link"
              href="https://github.com/luismeyer/pusher"
              target="_blank"
            >
              Repository
            </Button>
          </Layout.Footer>
        </Space>
      </main>
    </>
  );
}
