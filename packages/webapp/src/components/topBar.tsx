import { Button, Menu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";

import { useDatasAtom } from "@/state/data";
import { Action, isNavigationAction } from "@pusher/shared";

import { useActionsAtom } from "../state/actions";
import { getFirstParentAction } from "../utils/action";

export const TopBar: React.FC = () => {
  const { datas } = useDatasAtom();

  const { actionsStore, actions } = useActionsAtom();

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

  const createFlow = useCallback(() => {
    const firstAction = actions.find((action) => action.nextAction);

    const { action } = getFirstParentAction(
      actionsStore,
      firstAction ?? actions[0]
    );

    const data = transformActions(action);
    console.log(data);
  }, [actions, actionsStore, transformActions]);

  const items: MenuProps["items"] = useMemo(
    () => [
      { type: "group", label: <h1>Pusher Console</h1> },
      {
        type: "group",
        label: <Button onClick={createFlow}>Emulate</Button>,
      },
    ],
    [createFlow]
  );

  return <Menu theme="dark" mode="horizontal" items={items} />;
};
