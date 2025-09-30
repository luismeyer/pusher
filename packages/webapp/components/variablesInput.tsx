"use client";

import { ChevronsRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { removeItemFromArray, replaceItemInArray } from "../utils/array";
import { Input } from "./ui/input";

type VariablesInputProps = {
  executionIndex: number;
  variables: Record<string, string>;
  updateVariables: (index: number, variables: Record<string, string>) => void;
};

export const VariablesInput: React.FC<VariablesInputProps> = ({
  executionIndex,
  variables,
  updateVariables,
}) => {
  const autofocus = useRef<"name" | "value">();

  const [input, setInput] = useState<string>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [variablesList, setVariablesList] = useState<[string, string][]>(
    Object.entries(variables),
  );

  // Sync the variables state with the execution state
  useEffect(() => {
    const newVariables = variablesList.reduce<Record<string, string>>(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {},
    );

    if (JSON.stringify(newVariables) === JSON.stringify(variables)) {
      return;
    }

    updateVariables(executionIndex, newVariables);
  }, [executionIndex, updateVariables, variables, variablesList]);

  const updateVariable = useCallback(
    (options: { variableIndex: number; name?: string; value?: string }) => {
      const { variableIndex, name, value } = options;

      const [oldName, oldValue] = variablesList[variableIndex];

      const newName = name ?? oldName;
      const newValue = value ?? oldValue;

      // remove variable if both fields are empty
      if (!newName.length && !newValue.length) {
        inputRef.current?.focus();

        return setVariablesList(
          removeItemFromArray(variablesList, variableIndex),
        );
      }

      setVariablesList(
        replaceItemInArray(variablesList, variableIndex, [newName, newValue]),
      );
    },
    [variablesList],
  );

  const addVariable = useCallback(
    (options: { name?: string; value?: string }) => {
      const { name, value } = options;

      setVariablesList([...variablesList, [name ?? "", value ?? ""]]);
    },
    [variablesList],
  );

  return (
    <>
      {variablesList.map(([name, value], variableIndex) => (
        <div className="flex gap-4" key={variableIndex}>
          <Input
            autoFocus={
              autofocus.current === "name" &&
              variableIndex === variablesList.length - 1
            }
            value={name}
            placeholder={"Variable Name"}
            onChange={(e) =>
              updateVariable({ variableIndex, name: e.target.value })
            }
          />

          <div className="flex items-center">
            <ChevronsRightIcon />
          </div>

          <Input
            autoFocus={
              autofocus.current === "value" &&
              variableIndex === variablesList.length - 1
            }
            value={value}
            placeholder={"Variable Value"}
            onChange={(e) =>
              updateVariable({ variableIndex, value: e.target.value })
            }
          />
        </div>
      ))}

      <div className="flex gap-4">
        <Input
          ref={(ref) => (inputRef.current = ref)}
          placeholder={"Variable Name"}
          value={input}
          onChange={(e) => {
            if (!e.target.value) {
              return;
            }

            autofocus.current = "name";
            addVariable({ name: e.target.value });
            setInput("");
          }}
        />

        <div className="flex items-center">
          <ChevronsRightIcon />
        </div>

        <Input
          placeholder={"Variable Value"}
          value={input}
          onChange={(e) => {
            if (!e.target.value) {
              return;
            }

            autofocus.current = "value";
            addVariable({ value: e.target.value });
            setInput("");
          }}
        />
      </div>
    </>
  );
};
