import { Button, Menu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { actionTreeSelector } from "@/state/actions";
import { flowAtom } from "@/state/flow";
import { Flow } from "@pusher/shared";

export const TopBar: React.FC = () => {
  const [flowData] = useRecoilState(flowAtom);

  const actionTree = useRecoilValue(actionTreeSelector);

  const debugFlow = useCallback(async () => {
    const flow: Flow = {
      ...flowData,
      actionTree,
    };

    console.log(flow);

    const body = encodeURIComponent(JSON.stringify(flow));

    const response = await fetch(`/api/debug?flow=${body}`, {
      method: "POST",
    }).then((res) => res.json());

    console.log(response);
  }, [actionTree, flowData]);

  const items: MenuProps["items"] = useMemo(
    () => [
      { type: "group", label: <h1>Pusher Console</h1> },
      {
        type: "group",
        label: <Button onClick={debugFlow}>Emulate</Button>,
      },
    ],
    [debugFlow]
  );

  return <Menu theme="dark" mode="horizontal" items={items} />;
};
