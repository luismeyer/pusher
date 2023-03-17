import { useMemo } from "react";

import { useDataAtom } from "@/state/data";
import styles from "@/styles/action.module.css";
import { InfoCircleOutlined } from "@ant-design/icons";

import { TextInput } from "./textInput";
import { InputNumber } from "antd";

type ActionContentProps = {
  id: string;
};

export const ActionContent: React.FC<ActionContentProps> = ({ id }) => {
  const [data, setData] = useDataAtom(id);

  const inputs = useMemo(() => {
    let components: JSX.Element[] = [];

    if ("selector" in data) {
      const prefixOptions = [{ value: "#" }, { value: "." }, { value: "" }];

      components = [
        ...components,
        <TextInput
          key={components.length}
          value={data.selector}
          addonBeforeOptions={prefixOptions}
          placeholder="Enter CSS Selector"
          onChange={(value) => setData((pre) => ({ ...pre, selector: value }))}
        />,
      ];
    }

    if ("timeInSeconds" in data) {
      components = [
        ...components,
        <InputNumber
          key={components.length}
          value={data.timeInSeconds}
          addonAfter="Seconds"
          onChange={(value) =>
            setData((pre) => ({ ...pre, timeInSeconds: value ?? 0 }))
          }
        />,
      ];
    }

    if ("pageUrl" in data) {
      const prefixOptions = [{ value: "https://" }, { value: "http://" }];

      components = [
        ...components,
        <TextInput
          key={components.length}
          value={data.pageUrl}
          placeholder="google.com"
          addonBeforeOptions={prefixOptions}
          onChange={(value) => setData((pre) => ({ ...pre, pageUrl: value }))}
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
        <TextInput
          key={components.length}
          value={data.text}
          placeholder={placeholder}
          onChange={(value) => setData((pre) => ({ ...pre, text: value }))}
        />,
      ];
    }

    if (data.type === "telegram") {
      components = [
        ...components,
        <TextInput
          key={components.length}
          value={data.chatId}
          placeholder="Enter Telegram ChatId"
          onChange={(value) => setData((pre) => ({ ...pre, chatId: value }))}
        />,
        <TextInput
          key={components.length + 1}
          value={data.message}
          placeholder="Enter Telegram Message"
          onChange={(value) => setData((pre) => ({ ...pre, message: value }))}
        />,
      ];
    }

    return components;
  }, [data, setData]);

  return (
    <div className={styles.content}>
      {inputs.length === 0 && (
        <div className={styles.noContent}>
          <InfoCircleOutlined style={{ fontSize: 18, fontWeight: "bold" }} />
          <span>No Input needed here</span>
        </div>
      )}

      {inputs}
    </div>
  );
};
