import "@/styles/globals.css";

import { App as AntdApp, ConfigProvider } from "antd";
import { RecoilRoot } from "recoil";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AntdApp>
        <ConfigProvider>
          <Component {...pageProps} />
        </ConfigProvider>
      </AntdApp>
    </RecoilRoot>
  );
}
