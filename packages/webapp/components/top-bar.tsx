"use client";

import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

import { flowAtom } from "@/state/flow";
import { isInterval } from "@pusher/shared";

import { DebugModal } from "./debugModal";
import { ExecutionsDrawer } from "./executionsDrawer";

import { ResetModal } from "./resetModal";
import { SubmitModal } from "./submitModal";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  MenubarLabel,
} from "./ui/menubar";
import { useAddAction } from "@/state/actions";
import clsx from "clsx";
import { AlertCircleIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { ImportExportModal } from "./import-export-modal";
import { LoadFlowModal } from "./load-flow-modal";

export const TopBar: React.FC = () => {
  const [flowData, setFlowData] = useRecoilState(flowAtom);

  const [isDebugOpen, setIsDebugOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isLoadFlowOpen, setIsLoadFlowOpen] = useState(false);
  const [isExecutionsOpen, setIsExecutionsOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isImportExportOpen, setImportExportOpen] = useState(false);

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
      <div className="fixed top-0 left-10 flex flex-col gap-4 z-10 bg-white p-6 rounded-b shadow-lg border-gray-300 border-1">
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

        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>

            <MenubarContent>
              <MenubarItem onClick={() => setIsLoadFlowOpen(true)}>
                Load
              </MenubarItem>

              <MenubarItem onClick={() => setIsExecutionsOpen(true)}>
                Executions
              </MenubarItem>

              <MenubarItem onClick={() => setImportExportOpen(true)}>
                Import/Export
              </MenubarItem>

              <MenubarSeparator />

              <MenubarItem onClick={() => setIsResetOpen(true)}>
                Reset
              </MenubarItem>

              <MenubarItem onClick={() => setIsDebugOpen(true)}>
                Test
              </MenubarItem>

              <MenubarItem onClick={() => setIsSubmitOpen(true)}>
                Submit
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Settings</MenubarTrigger>

            <MenubarContent>
              <MenubarLabel className="flex items-center gap-1">
                Status
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {flowData.fails > 0 && (
                        <AlertCircleIcon
                          className={clsx({
                            "text-yellow-600": flowData.fails > 3,
                            "text-red-600": flowData.fails <= 3,
                          })}
                        />
                      )}
                    </TooltipTrigger>

                    <TooltipContent>
                      {flowData.fails >= 3
                        ? "Disabled after 3 failures"
                        : `Running with ${flowData.fails} failure${
                            flowData.fails > 1 ? "s" : ""
                          }`}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </MenubarLabel>

              <MenubarItem
                onClick={() => setFlowData((pre) => ({ ...pre, fails: 0 }))}
              >
                Reset Failures
              </MenubarItem>

              <MenubarCheckboxItem
                className={clsx({ "text-yellow-600": flowData.disabled })}
                checked={!flowData.disabled}
                onCheckedChange={(update) =>
                  setFlowData((pre) => ({ ...pre, disabled: !update }))
                }
              >
                {flowData.disabled ? "Disabled" : "Enabled"}
              </MenubarCheckboxItem>

              <MenubarSeparator />

              <MenubarLabel>Interval</MenubarLabel>

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

      <ImportExportModal
        open={isImportExportOpen}
        setOpen={setImportExportOpen}
      />

      <LoadFlowModal
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
