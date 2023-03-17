import { Button, Menu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";

import { useDatasAtom } from "@/state/data";
import { Action, Flow, isNavigationAction } from "@pusher/shared";

import { useActionsAtom } from "../state/actions";
import { getFirstParentAction } from "../utils/action";
import { useFlowAtom } from "../state/flow";

export const TopBar: React.FC = () => {
  const { datas } = useDatasAtom();

  const { actionsStore, actions } = useActionsAtom();

  const [flowData] = useFlowAtom();

  const transformActions = useCallback(
    (action: { id: string; nextAction?: string }): Action => {
      const data = datas[action.id];

      const nextFrontendAction = actionsStore[action.nextAction ?? ""];

      const nextAction = nextFrontendAction
        ? transformActions(nextFrontendAction)
        : undefined;

      if (isNavigationAction(data)) {
        return {
          ...data,
          nextAction,
        };
      }

      return {
        ...data,
      };
    },
    [datas, actionsStore]
  );

  const debugFlow = useCallback(async () => {
    const firstAction = actions.find((action) => action.nextAction);

    const { action } = getFirstParentAction(
      actionsStore,
      firstAction ?? actions[0]
    );

    const actionTree = transformActions(action);

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
  }, [actions, actionsStore, flowData, transformActions]);

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
