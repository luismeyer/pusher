import "@/styles/globals.css";

import { App as AntdApp } from "antd";
import { RecoilRoot } from "recoil";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AntdApp>
        <Component {...pageProps} />
      </AntdApp>
    </RecoilRoot>
  );
}
