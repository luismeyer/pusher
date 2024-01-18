"use client";

import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import { isInterval } from "@pusher/shared";

import { DebugModal } from "./debugModal";
import { ExecutionsDrawer } from "./executionsDrawer";
import { LoadFlowDrawer } from "./loadFlowDrawer";
import { ResetModal } from "./resetModal";
import { SubmitModal } from "./submitModal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "./ui/menubar";
import { useAddAction } from "@/state/actions";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);
  const [isExecutionsOpen, setIsExecutionsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const { addAction, id } = useAddAction();

  const items = useMemo(
    () => [
      {
        label: "Navigation",
        key: "navigation",
        children: [
          {
            key: "click",
            label: "Click",
            onClick: () => addAction({ id, type: "click", selector: "" }),
          },
          {
            key: "scroll",
            label: "Scroll To Bottom",
            onClick: () => addAction({ id, type: "scrollToBottom" }),
          },
          {
            key: "timeout",
            label: "Timeout",
            onClick: () => addAction({ id, type: "timeout", timeInSeconds: 0 }),
          },
          {
            key: "wait",
            label: "Wait For Element",
            onClick: () => addAction({ id, type: "waitFor", selector: "" }),
          },
          {
            key: "open",
            label: "Open Page",
            onClick: () => addAction({ id, type: "openPage", pageUrl: "" }),
          },
          {
            key: "type",
            label: "Type Text",
            onClick: () =>
              addAction({ id, type: "type", selector: "", text: "" }),
          },
          {
            key: "store",
            label: "Store Text Content",
            onClick: () =>
              addAction({
                id,
                type: "storeTextContent",
                selector: "",
                variableName: "",
              }),
          },
          {
            key: "keyboard",
            label: "Keyboard Input",
            onClick: () =>
              addAction({
                id,
                type: "keyboard",
                key: "Enter",
              }),
          },
        ],
      },
      {
        label: "Decision",
        key: "decisions",
        children: [
          {
            key: "exists",
            label: "Element Exists",
            onClick: () => addAction({ id, type: "exists", selector: "" }),
          },
          {
            key: "contetnMatches",
            label: "Text Content Matches",
            onClick: () =>
              addAction({
                id,
                type: "textContentMatches",
                selector: "",
                text: "",
              }),
          },
        ],
      },
      {
        label: "Output",
        key: "output",
        children: [
          {
            key: "11",
            label: "Telegram",
            onClick: () =>
              addAction({ id, type: "telegram", chatId: "", message: "" }),
          },
        ],
      },
    ],
    [addAction, id]
  );

  return (
    <>
      <div className="flex justify-between gap-5 items-center p-4">
        <div className="grid grid-cols-3 gap-2 w-1/2">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Name"
              value={flowData.name}
              onChange={(e) =>
                setFlowData((pre) => ({ ...pre, name: e.target.value }))
              }
            />
          </div>

          <div>
            <Label className="text-black" htmlFor="fails">
              Fails
            </Label>
            <Input
              id="fails"
              value={flowData.fails}
              onChange={(e) =>
                setFlowData((pre) => ({
                  ...pre,
                  fails: Number(e.target.value ?? 0),
                }))
              }
            />
          </div>
        </div>

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>

            <MenubarContent>
              <MenubarItem onClick={() => setIsResetOpen(true)}>
                Reset
              </MenubarItem>

              <MenubarItem onClick={() => setIsDebugOpen(true)}>
                Test
              </MenubarItem>

              <MenubarSeparator />

              <MenubarCheckboxItem
                checked={!flowData.disabled}
                onCheckedChange={(update) =>
                  setFlowData((pre) => ({ ...pre, disabled: !update }))
                }
              >
                {flowData.disabled ? "Disabled" : "Enabled"}
              </MenubarCheckboxItem>

              <MenubarItem onClick={() => setIsSubmitOpen(true)}>
                Submit
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Settings</MenubarTrigger>

            <MenubarContent>
              <MenubarItem onClick={() => setIsLoadFlowOpen(true)}>
                Load
              </MenubarItem>

              <MenubarItem onClick={() => setIsExecutionsOpen(true)}>
                Executions
              </MenubarItem>

              <MenubarSeparator />

              <MenubarRadioGroup
                value={flowData.interval}
                onValueChange={(value) => {
                  if (isInterval(value)) {
                    setFlowData((pre) => ({ ...pre, interval: value }));
                  }
                }}
              >
                {["6h", "12h"].map((interval) => (
                  <MenubarRadioItem key={interval} value={interval}>
                    {interval}
                  </MenubarRadioItem>
                ))}
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Actions</MenubarTrigger>

            <MenubarContent>
              {items.map((group) => (
                <MenubarSub key={group.key}>
                  <MenubarSubTrigger>{group.label}</MenubarSubTrigger>

                  <MenubarSubContent>
                    {group.children.map((item) => (
                      <MenubarItem key={item.key} onClick={item.onClick}>
                        {item.label}
                      </MenubarItem>
                    ))}
                  </MenubarSubContent>
                </MenubarSub>
              ))}
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <LoadFlowDrawer
        defaultId={flowData.id}
        open={isLoadFlowOpen}
        setOpen={setIsLoadFlowOpen}
      />

      <DebugModal open={isDebugOpen} setOpen={setIsDebugOpen} />

      <SubmitModal open={isSubmitOpen} setOpen={setIsSubmitOpen} />

      <ExecutionsDrawer open={isExecutionsOpen} setOpen={setIsExecutionsOpen} />

      <ResetModal open={isResetOpen} setOpen={setIsResetOpen} />
    </>
  );
};
