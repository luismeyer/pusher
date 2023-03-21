import { Input, App, Modal, Space } from "antd";

import React, { useCallback, useEffect, useState } from "react";
import { clearToken, loadToken, storeToken } from "../utils/auth";
import { fetchApi } from "../utils/fetchApi";

export const AuthModal: React.FC = () => {
  const { message } = App.useApp();

  const [open, setOpen] = useState<boolean>(false);

  const [token, setToken] = useState<string | undefined>();

  const isValidToken = useCallback(async () => {
    const response = await fetchApi("token");

    return Boolean(response);
  }, []);

  const testToken = useCallback(
    async (apiToken: string) => {
      storeToken(apiToken);

      return isValidToken().then((valid) => {
        if (!valid) {
          message.open({ type: "error", content: "Wrong Token" });

          clearToken();
        }

        setOpen(!valid);
      });
    },
    [isValidToken, message]
  );

  useEffect(() => {
    const token = loadToken();

    if (!token) {
      setOpen(true);
      return;
    }

    testToken(token);
  }, [isValidToken, testToken]);

  return (
    <Modal
      open={open}
      title="Login"
      centered
      cancelButtonProps={{ style: { display: "none" } }}
      okText="Submit"
      onOk={() => testToken(token ?? "")}
    >
      <Space direction="vertical">
        <p>
          Because Pusher is still under development the Console is only
          available for certain users
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
