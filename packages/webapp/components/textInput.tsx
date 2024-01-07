"use client";

import { Input, Select, Tooltip } from "antd";
import React, { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";

import { defaultVariables } from "../state/flow";
import { WarningOutlined } from "@ant-design/icons";
import { storedVariablesSelector } from "../state/actions";

type TextInputProps = {
  addonBeforeOptions?: { value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
  id: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  addonBeforeOptions,
  placeholder,
  onChange,
  value: fullValue,
  id,
}) => {
  const variables = useRecoilValue(defaultVariables);

  const storedVariables = useRecoilValue(storedVariablesSelector(id));

  const { prefix, value } = useMemo(() => {
    const prefixInValue = addonBeforeOptions?.find(({ value }) =>
      fullValue.startsWith(value)
    );

    if (!prefixInValue) {
      if (!addonBeforeOptions?.length) {
        return { prefix: "", value: fullValue };
      }

      return { prefix: addonBeforeOptions[0].value, value: fullValue };
    }

    return {
      value: fullValue.replace(prefixInValue.value, ""),
      prefix: prefixInValue.value,
    };
  }, [addonBeforeOptions, fullValue]);

  const handleInputChange = useCallback(
    (options: { prefix?: string; value?: string }) => {
      onChange((options.prefix ?? prefix) + (options.value ?? value));
    },
    [onChange, prefix, value]
  );

  const addonBefore = useMemo(() => {
    if (!addonBeforeOptions) {
      return;
    }

    return (
      <Select
        value={prefix}
        options={addonBeforeOptions}
        onChange={(value) => handleInputChange({ prefix: value })}
      />
    );
  }, [addonBeforeOptions, handleInputChange, prefix]);

  const variableNames = useMemo(() => {
    const regex = /{{[\w|\s]*}}/g;

    const matches = value.match(regex) ?? [];

    return matches.map((match) =>
      match.replace("{{", "").replace("}}", "").trim()
    );
  }, [value]);

  const error = useMemo(() => {
    if (!variableNames) {
      return;
    }

    return variableNames
      .filter(
        (name) => !variables.includes(name) && !storedVariables.includes(name)
      )
      .join(", ");
  }, [storedVariables, variableNames, variables]);

  return (
    <Input
      status={error ? "error" : undefined}
      addonBefore={addonBefore}
      suffix={
        error ? (
          <Tooltip title={error ? `Wrong variable: "${error}"` : undefined}>
            <WarningOutlined />{" "}
          </Tooltip>
        ) : (
          // render empty div to keep the input focused
          <div />
        )
      }
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleInputChange({ value: e.target.value })}
    />
  );
};
