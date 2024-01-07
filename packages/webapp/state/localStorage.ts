import { AtomEffect } from "recoil";

import { isServer } from "../utils/ssr";

export const localStorageEffect: AtomEffect<any> = ({
  setSelf,
  onSet,
  node,
  trigger,
}) => {
  if (isServer) {
    return;
  }

  const { key } = node;

  if (trigger === "get") {
    const savedValue = localStorage.getItem(key);

    if (savedValue !== null) {
      setSelf(JSON.parse(savedValue));
    }
  }

  onSet((newValue, _, isReset) => {
    if (isReset) {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, JSON.stringify(newValue));
  });
};
