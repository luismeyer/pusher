import { Input, Select } from "antd";
import React, { useCallback, useEffect, useMemo, useRef } from "react";

type TextInputProps = {
  addonBeforeOptions?: { value: string }[];
  placeholder?: string;
  onChange: (value: string) => void;
  value: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  addonBeforeOptions,
  placeholder,
  onChange,
  value: fullValue,
}) => {
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

  return (
    <Input
      addonBefore={addonBefore}
      placeholder={placeholder}
      value={value}
      onChange={(e) => handleInputChange({ value: e.target.value })}
    />
  );
};
