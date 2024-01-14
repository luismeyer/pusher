"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { defaultVariables, executionsSelector } from "@/state/flow";
import { Execution } from "@pusher/shared";

import { removeItemFromArray, replaceItemInArray } from "../utils/array";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { VariablesInput } from "./variablesInput";

type ExecutionsInputProps = {
  index: number;
  execution: Execution;
};

export const ExecutionsInput: React.FC<ExecutionsInputProps> = ({
  index,
  execution,
}) => {
  const [executions, setExecutions] = useRecoilState(executionsSelector);

  const deleteExecution = useCallback(
    (index: number) => setExecutions(removeItemFromArray(executions, index)),
    [executions, setExecutions]
  );

  const updateExecution = useCallback(
    (index: number, execution: Execution) =>
      setExecutions(replaceItemInArray(executions, index, execution)),
    [executions, setExecutions]
  );

  const updateVariables = useCallback(
    (executionIndex: number, variables: Record<string, string>) => {
      const { [executionIndex]: execution } = executions;

      updateExecution(executionIndex, { ...execution, variables });
    },
    [executions, updateExecution]
  );

  const minimumVariables = useRecoilValue(defaultVariables);

  const missingVariables = useMemo(
    () => minimumVariables.filter((name) => !execution.variables[name]),
    [execution.variables, minimumVariables]
  );

  return (
    <div className="flex flex-col w-full gap-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xl">Execution {index + 1}</h3>

        <TooltipProvider>
          <Tooltip>
            {missingVariables.length > 0 && (
              <TooltipTrigger asChild>
                <AlertTriangle className="text-yellow-400" size={18} />
              </TooltipTrigger>
            )}

            <TooltipContent>
              Missing Value for: {missingVariables.join(", ")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex gap-4">
        <Input
          value={execution.name}
          placeholder={"Execution Name"}
          onChange={(e) =>
            updateExecution(index, { ...execution, name: e.target.value })
          }
        />

        <Button variant="destructive" onClick={() => deleteExecution(index)}>
          Delete
        </Button>
      </div>

      <VariablesInput
        variables={execution.variables}
        updateVariables={updateVariables}
        executionIndex={index}
      />
    </div>
  );
};
