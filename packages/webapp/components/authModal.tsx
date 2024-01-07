"use client";

import { App, Input, Modal, Space } from "antd";
import React, { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

import { authOpenAtom } from "@/state/auth";

import { clearToken, storeToken } from "../utils/auth";
import { tokenAction } from "@/app/api/token.action";
import { useActionCall } from "@/hooks/useActionCall";

export const AuthModal: React.FC = () => {
  const { message } = App.useApp();

  const [open, setOpen] = useRecoilState(authOpenAtom);

  const [token, setToken] = useState<string | undefined>();

  const isValidToken = useActionCall(tokenAction);

  const testToken = useCallback(
    async (apiToken: string) => {
      storeToken(apiToken);

      const valid = await isValidToken();

      if (!valid) {
        message.open({ type: "error", content: "Wrong Token" });

        clearToken();
        setToken("");

        return;
      }

      setOpen(!valid);
    },
    [isValidToken, message, setOpen]
  );

  return (
    <Modal
      open={open}
      title="Login"
      centered
      okText="Submit Token"
      cancelText="Continue without Api"
      onOk={() => testToken(token ?? "")}
      onCancel={() => setOpen(false)}
    >
      <Space direction="vertical">
        <p>
          Because Pusher is still under development the Api is only available
          for certain users. You can still use the Webapp though.
        </p>

        <Input
          type="password"
          autoComplete="password"
          placeholder="Your PHR Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </Space>
    </Modal>
  );
};
