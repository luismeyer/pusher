"use client";

import { Button, Col, Input, Row, theme, Tooltip } from "antd";
import { useCallback, useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { defaultVariables, executionsSelector } from "@/state/flow";
import { WarningOutlined } from "@ant-design/icons";
import { Execution } from "@pusher/shared";

import { removeItemFromArray, replaceItemInArray } from "../utils/array";
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

  const {
    token: { colorWarning },
  } = theme.useToken();

  const minimumVariables = useRecoilValue(defaultVariables);

  const missingVariables = useMemo(
    () => minimumVariables.filter((name) => !execution.variables[name]),
    [execution.variables, minimumVariables]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        gap: 12,
      }}
    >
      <Row align="middle" gutter={10}>
        <Col>
          <h3>Execution {index + 1}</h3>
        </Col>

        <Col>
          {missingVariables.length > 0 && (
            <Tooltip
              title={`Missing Value for: ${missingVariables.join(", ")}`}
            >
              <WarningOutlined style={{ color: colorWarning }} />
            </Tooltip>
          )}
        </Col>
      </Row>

      <Row align="middle" justify="space-between">
        <Col span={12}>
          <Input
            value={execution.name}
            placeholder={"Execution Name"}
            onChange={(e) =>
              updateExecution(index, {
                ...execution,
                name: e.target.value,
              })
            }
          />
        </Col>

        <Col>
          <Button danger onClick={() => deleteExecution(index)}>
            Delete
          </Button>
        </Col>
      </Row>

      <VariablesInput
        variables={execution.variables}
        updateVariables={updateVariables}
        executionIndex={index}
      />
    </div>
  );
};
