import { Input, Select } from "antd";
import React, { useCallback, useMemo, useRef } from "react";

type TextInputProps = {
  addonBeforeOptions?: { value: string }[];
  addonAfterOptions?: { value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
};

export const TextInput: React.FC<TextInputProps> = ({
  addonBeforeOptions,
  addonAfterOptions,
  placeholder,
  onChange,
}) => {
  const prefix = useRef<string>("");
  const suffix = useRef<string>("");
  const value = useRef<string>("");

  const handleInputChange = useCallback(
    (options: { prefix?: string; value?: string; suffix?: string }) => {
      if (options.prefix) {
        prefix.current = options.prefix;
      }

      if (options.value) {
        value.current = options.value;
      }

      if (options.suffix) {
        suffix.current = options.suffix;
      }

      onChange(prefix.current + value.current + suffix.current);
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

  const addonAfter = useMemo(() => {
    if (addonAfterOptions) {
      prefix.current = addonAfterOptions[0].value;

      return (
        <Select
          defaultValue={prefix.current}
          options={addonAfterOptions}
          onChange={(value) => handleInputChange({ suffix: value })}
        />
      );
    }
  }, [addonAfterOptions, handleInputChange]);

  return (
    <Input
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      placeholder={placeholder}
      onChange={(e) => handleInputChange({ value: e.target.value })}
    />
  );
};
