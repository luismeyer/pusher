"use client";

import React, { useMemo } from "react";
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

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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

  const handleDeleteClick = async () => {
    await deleteAction(id);
  };

  const startConnect = (connectType: ConnectType) => {
    if (connectStart) {
      return;
    }

    // start connect

    setConnectStart(id);
    setConnectType(connectType);
  };

  const handleConnectClick: ButtonClickHandler = (event) => {
    // prevent click on canvas or line
    event.stopPropagation();

    if (nextAction) {
      resetRelation();
      return;
    }

    startConnect("default");
  };

  const decisionAction = useMemo(() => isDecisionAction(data), [data]);

  return (
    <div className="flex gap-2">
      {!decisionAction && (
        <Button
          variant={nextAction ? "destructive" : "outline"}
          disabled={disabled}
          onClick={handleConnectClick}
        >
          {nextAction ? <DisconnectOutlined /> : <ApiOutlined />}
        </Button>
      )}

      {decisionAction && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={
                falseNextAction && trueNextAction ? "destructive" : "secondary"
              }
            >
              {falseNextAction && trueNextAction ? (
                <DisconnectOutlined />
              ) : (
                <ApiOutlined />
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Connections</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();

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
              }}
            >
              If true
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={(event: React.MouseEvent) => {
                event.stopPropagation();

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
              }}
            >
              If false
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Button
        variant="destructive"
        disabled={disabled}
        onClick={handleDeleteClick}
      >
        <DeleteOutlined />
      </Button>
    </div>
  );
};
