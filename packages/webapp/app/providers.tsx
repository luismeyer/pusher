"use client";

import { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
