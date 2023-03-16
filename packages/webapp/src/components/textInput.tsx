import { Input, Select } from "antd";
import React, { useCallback, useMemo, useRef } from "react";

type TextInputProps = {
  addonBeforeOptions?: { value: string }[];
  addonBefore?: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

export const TextInput: React.FC<TextInputProps> = ({
  addonBeforeOptions,
  placeholder,
  onChange,
}) => {
  const prefix = useRef<string>("");
  const value = useRef<string>("");

  const handleInputChange = useCallback(
    (options: { prefix?: string; value?: string }) => {
      if (options.prefix) {
        prefix.current = options.prefix;
      }

      if (options.value) {
        value.current = options.value;
      }

      onChange(prefix.current + value.current);
    },
    [onChange]
  );

  const addonBefore = useMemo(() => {
    if (addonBeforeOptions) {
      prefix.current = addonBeforeOptions[0].value;

      return (
        <Select
          defaultValue={prefix.current}
          options={addonBeforeOptions}
          onChange={(value) => handleInputChange({ prefix: value })}
        />
      );
    }
  }, [addonBeforeOptions, handleInputChange]);

  return (
    <Input
      addonBefore={addonBefore}
      placeholder={placeholder}
      onChange={(e) => handleInputChange({ value: e.target.value })}
    />
  );
};
