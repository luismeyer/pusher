import { Button, Dropdown } from "antd";
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
import styles from "@/styles/action.module.css";
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

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  id,
  disabled,
}) => {
  const deleteAction = useDeleteAction(id);

  const [{ falseNextAction, nextAction, trueNextAction }, setRelation] =
    useRecoilState(relationAtom(id));

  const [connectStart, setConnectStart] = useRecoilState(connectStartAtom);

  const resetRelation = useResetRecoilState(relationAtom(id));

  const data = useRecoilValue(dataAtom(id));

  const setConnectType = useSetRecoilState(connectTypeAtom);

  const handleDeleteClick = useCallback(() => {
    deleteAction();
  }, [deleteAction]);

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

  const handleConnectClickTrue = useCallback(() => {
    if (trueNextAction && falseNextAction) {
      setRelation((pre) => ({ ...pre, trueNextAction: undefined }));
      return;
    }

    if (trueNextAction) {
      resetRelation();
      return;
    }

    startConnect("true");
  }, [
    falseNextAction,
    resetRelation,
    setRelation,
    startConnect,
    trueNextAction,
  ]);

  const handleConnectClickFalse = useCallback(() => {
    if (falseNextAction && trueNextAction) {
      setRelation((pre) => ({ ...pre, falseNextAction: undefined }));
      return;
    }

    if (falseNextAction) {
      resetRelation();
      return;
    }

    startConnect("false");
  }, [
    falseNextAction,
    resetRelation,
    setRelation,
    startConnect,
    trueNextAction,
  ]);

  const handleConnectClick = useCallback(() => {
    if (nextAction) {
      resetRelation();
      return;
    }

    startConnect("default");
  }, [nextAction, resetRelation, startConnect]);

  const decisionAction = useMemo(() => isDecisionAction(data), [data]);

  return (
    <div className={styles.buttons}>
      {!decisionAction && (
        <Button
          type="dashed"
          shape="round"
          danger={Boolean(nextAction) || connectStart === id}
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
                  onClick: handleConnectClickTrue,
                },
                {
                  label: "If false",
                  key: 2,
                  onClick: handleConnectClickFalse,
                },
              ],
            }}
          >
            <Button type="dashed" shape="round">
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
    </div>
  );
};
