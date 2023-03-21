import { Input, message, Modal } from "antd";

import React, { useCallback, useEffect, useState } from "react";
import { clearToken, loadToken, storeToken } from "../utils/auth";
import { fetchApi } from "../utils/fetchApi";

export const AuthModal: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

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
          messageApi.open({ type: "error", content: "Wrong Token" });

          clearToken();
        }

        setOpen(!valid);
      });
    },
    [isValidToken, messageApi]
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
    <>
      {contextHolder}

      <Modal
        open={open}
        title="Login"
        centered
        cancelButtonProps={{ style: { display: "none" } }}
        okText="Submit"
        onOk={() => testToken(token ?? "")}
      >
        <p style={{ marginBottom: 12 }}>
          Because Pusher is still under development the Console is only
          available for certain users
        </p>

        <Input
          placeholder="Your PHR Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </Modal>
    </>
  );
};
