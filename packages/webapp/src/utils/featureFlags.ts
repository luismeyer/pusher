import React from "react";

export type FeatureFlags = {
  enableKeyboardInputAction: boolean;
};

export const FeatureFlagsContext = React.createContext<FeatureFlags>({
  enableKeyboardInputAction: false,
});

export const useFeatureFlag = (flag: keyof FeatureFlags) => {
  const context = React.useContext(FeatureFlagsContext);

  return context[flag];
};
