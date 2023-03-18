import { atom } from "recoil";

export const connectStartAtom = atom<string | undefined>({
  key: "ConnectStart",
  default: undefined,
});

export const connectEndAtom = atom<string | undefined>({
  key: "ConnectEnd",
  default: undefined,
});
