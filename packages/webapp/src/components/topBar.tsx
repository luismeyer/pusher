import { Button, Menu, MenuProps } from "antd";
import { useCallback, useMemo } from "react";

import { useDatasAtom } from "@/state/data";
import { Action, isNavigationAction } from "@pusher/shared";

import { Action as FrontendAction, useActionsAtom } from "../state/actions";

export const TopBar: React.FC = () => {
  const { datas } = useDatasAtom();

  const { actions } = useActionsAtom();

  console.log(datas);

  const transformActions = useCallback(
    (action: FrontendAction): Action => {
      const data = datas[action.id];

      const nextFrontendAction = actions.find(
        ({ id }) => id === action.nextAction
      );

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
    [actions, datas]
  );

  const createFlow = useCallback(() => {
    const [firstAction] = actions;

    const data = transformActions(firstAction);
    console.log(data);
  }, [actions, transformActions]);

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
