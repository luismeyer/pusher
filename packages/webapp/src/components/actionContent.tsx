import { useMemo } from "react";

import { useDataAtom } from "@/state/data";

import { TextInput } from "./textInput";

type ActionContentProps = {
  id: string;
};

export const ActionContent: React.FC<ActionContentProps> = ({ id }) => {
  const [data, setData] = useDataAtom(id);

  const inputs = useMemo(() => {
    let components: JSX.Element[] = [];

    if ("selector" in data) {
      const selectorOptions = [{ value: "#" }, { value: "." }, { value: "" }];

      components = [
        ...components,
        <TextInput
          key={components.length}
          addonBeforeOptions={selectorOptions}
          placeholder="Enter CSS Selector"
          onChange={(value) => setData((pre) => ({ ...pre, selector: value }))}
        />,
      ];
    }

    return components;
  }, [data, setData]);

  return <div>{inputs}</div>;
};
