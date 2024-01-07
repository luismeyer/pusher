"use client";

import { Button, Dropdown, Space } from "antd";
import React, { useCallback, useMemo } from "react";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";

import { useDeleteAction } from "@/state/actions";
import {
  connectStartAtom,
  ConnectType,
  connectTypeAtom,
} from "@/state/connect";
import { dataAtom } from "@/state/data";
import { relationAtom } from "@/state/relation";
import {
  ApiOutlined,
  DeleteOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import { isDecisionAction } from "@pusher/shared";

type ActionButtonsProps = {
  id: string;
  disabled?: boolean;
};

type ButtonClickHandler = React.MouseEventHandler<HTMLAnchorElement> &
  React.MouseEventHandler<HTMLButtonElement>;

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  disabled,
}) => {
  const deleteAction = useDeleteAction();

  const [{ falseNextAction, nextAction, trueNextAction }, setRelation] =
    useRecoilState(relationAtom(id));

  const [connectStart, setConnectStart] = useRecoilState(connectStartAtom);

  const resetRelation = useResetRecoilState(relationAtom(id));

  const data = useRecoilValue(dataAtom(id));

  const setConnectType = useSetRecoilState(connectTypeAtom);

  const handleDeleteClick = useCallback(async () => {
    await deleteAction(id);
  }, [deleteAction, id]);

  const startConnect = useCallback(
    (connectType: ConnectType) => {
      if (connectStart) {
        return;
      }

      // start connect

      setConnectStart(id);
      setConnectType(connectType);
    },
    [connectStart, id, setConnectStart, setConnectType]
  );

  const handleConnectClick: ButtonClickHandler = useCallback(
    (event) => {
      // prevent click on canvas or line
      event.stopPropagation();

      if (nextAction) {
        resetRelation();
        return;
      }

      startConnect("default");
    },
    [nextAction, resetRelation, startConnect]
  );

  const decisionAction = useMemo(() => isDecisionAction(data), [data]);

  return (
    <Space size="small">
      {!decisionAction && (
        <Button
          type="dashed"
          shape="round"
          danger={Boolean(nextAction)}
          disabled={disabled}
          onClick={handleConnectClick}
          icon={nextAction ? <DisconnectOutlined /> : <ApiOutlined />}
        />
      )}

      {decisionAction && (
        <>
          <Dropdown
            disabled={disabled}
            menu={{
              items: [
                {
                  label: "If true",
                  key: 1,
                  onClick: (info) => {
                    // prevent click on canvas or line
                    info.domEvent.stopPropagation();

                    if (trueNextAction && falseNextAction) {
                      setRelation((pre) => ({
                        ...pre,
                        trueNextAction: undefined,
                      }));
                      return;
                    }

                    if (trueNextAction) {
                      resetRelation();
                      return;
                    }

                    startConnect("true");
                  },
                  danger: Boolean(trueNextAction),
                },
                {
                  label: "If false",
                  key: 2,
                  onClick: (info) => {
                    // prevent click on canvas or line
                    info.domEvent.stopPropagation();

                    if (falseNextAction && trueNextAction) {
                      setRelation((pre) => ({
                        ...pre,
                        falseNextAction: undefined,
                      }));
                      return;
                    }

                    if (falseNextAction) {
                      resetRelation();
                      return;
                    }

                    startConnect("false");
                  },
                  danger: Boolean(falseNextAction),
                },
              ],
            }}
          >
            <Button
              danger={Boolean(falseNextAction && trueNextAction)}
              type="dashed"
              shape="round"
            >
              {falseNextAction && trueNextAction ? (
                <DisconnectOutlined />
              ) : (
                <ApiOutlined />
              )}
            </Button>
          </Dropdown>
        </>
      )}

      <Button
        type="dashed"
        shape="round"
        danger
        disabled={disabled}
        icon={<DeleteOutlined />}
        onClick={handleDeleteClick}
      />
    </Space>
  );
};
