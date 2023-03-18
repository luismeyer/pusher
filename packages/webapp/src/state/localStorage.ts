import { AtomEffect } from "recoil";
import { isServer } from "../utils/ssr";

export const localStorageEffect: AtomEffect<any> = ({
  setSelf,
  onSet,
  node,
}) => {
  if (isServer) {
    return;
  }

  const { key } = node;

  const savedValue = localStorage.getItem(key);

  if (savedValue !== null) {
    setSelf(JSON.parse(savedValue));
  }

  onSet((newValue, _, isReset) => {
    console.log("test", key);
    isReset
      ? localStorage.removeItem(key)
      : localStorage.setItem(key, JSON.stringify(newValue));
  });
};
