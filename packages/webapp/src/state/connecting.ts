import { atom } from "recoil";

type Connection = {
  actionA?: string;
  actionB?: string;
};

export const connectingAtom = atom<Connection>({
  key: "Connecting",
  default: {},
});
