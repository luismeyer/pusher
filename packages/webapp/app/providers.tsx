"use client";

import { App as AntdApp, ConfigProvider } from "antd";
import { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <RecoilRoot>
      <AntdApp>
        <ConfigProvider>{children}</ConfigProvider>
      </AntdApp>
    </RecoilRoot>
  );
};
