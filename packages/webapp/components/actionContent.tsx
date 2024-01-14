"use client";

import { useMemo } from "react";
import { useRecoilState } from "recoil";

import { dataAtom } from "@/state/data";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Keys } from "@pusher/shared";

import { Combobox } from "./ui/combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type ActionContentProps = {
  id: string;
};

export const ActionContent: React.FC<ActionContentProps> = ({ id }) => {
  const [data, setData] = useRecoilState(dataAtom(id));

  const inputs = useMemo(() => {
    let components: JSX.Element[] = [];

    if ("selector" in data) {
      components = [
        ...components,
        <Input
          id={id}
          key={components.length}
          value={data.selector}
          placeholder="Enter CSS Selector"
          onChange={(event) =>
            setData((pre) => ({ ...pre, selector: event.target.value }))
          }
        />,
      ];
    }

    if ("timeInSeconds" in data) {
      const key = "seconds" + id;

      components = [
        ...components,
        <div key={key} className="grid w-full gap-1.5">
          <Label htmlFor={key}>Time in seconds</Label>
          <Input
            id={key}
            type="number"
            value={data.timeInSeconds}
            onChange={(value) =>
              setData((pre) => ({
                ...pre,
                timeInSeconds: Number(value.target.value) ?? 0,
              }))
            }
          />
        </div>,
      ];
    }

    if ("pageUrl" in data) {
      components = [
        ...components,
        <Input
          id={id}
          key={components.length}
          value={data.pageUrl}
          placeholder="google.com"
          onChange={(value) =>
            setData((pre) => ({ ...pre, pageUrl: value.target.value }))
          }
        />,
      ];
    }

    if ("text" in data) {
      let placeholder = "Enter Text";

      if (data.type === "type") {
        placeholder = placeholder + " to type";
      }

      if (data.type === "textContentMatches") {
        placeholder = placeholder + " to match against";
      }

      components = [
        ...components,
        <Input
          id={id}
          key={components.length}
          value={data.text}
          placeholder={placeholder}
          onChange={(value) =>
            setData((pre) => ({ ...pre, text: value.target.value }))
          }
        />,
      ];
    }

    if (data.type === "telegram") {
      components = [
        ...components,
        <Input
          id={id}
          key={components.length}
          value={data.chatId}
          placeholder="Enter Telegram ChatId"
          onChange={(value) =>
            setData((pre) => ({ ...pre, chatId: value.target.value }))
          }
        />,
        <Input
          id={id}
          key={components.length + 1}
          value={data.message}
          placeholder="Enter Telegram Message"
          onChange={(value) =>
            setData((pre) => ({ ...pre, message: value.target.value }))
          }
        />,
      ];
    }

    if (data.type === "storeTextContent") {
      components = [
        ...components,
        <Input
          id={id}
          key={components.length}
          value={data.variableName}
          placeholder="Enter VariableName to store the TextContent"
          onChange={(value) =>
            setData((pre) => ({ ...pre, variableName: value.target.value }))
          }
        />,
      ];
    }

    if (data.type === "keyboard") {
      components = [
        ...components,
        <Combobox
          key={components.length}
          label="Search key..."
          data={Keys.map((item) => ({ value: item, label: item }))}
        />,
      ];
    }

    return components;
  }, [data, id, setData]);

  return (
    <div className="grid gap-2">
      {inputs.length === 0 && (
        <div className="flex flex-col items-center">
          <InfoCircleOutlined />

          <span>No Input needed here</span>
        </div>
      )}

      {inputs}
    </div>
  );
};
