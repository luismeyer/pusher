"use client";

import React, { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";

import { storedVariablesSelector } from "@/state/actions";
import { defaultVariables } from "@/state/flow";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const EMPTY = "EMPTY";

type TextInputProps = {
  addonBeforeOptions?: { label?: string; value: string }[];
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
      const parsedPrefix = (options.prefix ?? prefix).replace(EMPTY, "");

      onChange(parsedPrefix + (options.value ?? value));
    },
    [onChange, prefix, value]
  );

  const addonBefore = useMemo(() => {
    if (!addonBeforeOptions) {
      return null;
    }

    return (
      <Select
        value={prefix}
        onValueChange={(value) => handleInputChange({ prefix: value })}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Prefix" />
        </SelectTrigger>

        <SelectContent>
          {addonBeforeOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label ?? value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
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
    <div className="grid gap-1">
      <div className="flex gap-1">
        {addonBefore}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange({ value: e.target.value })}
        />
      </div>

      {error && (
        <span className="text-yellow-600">Wrong variable: {error}</span>
      )}
    </div>
  );
};
