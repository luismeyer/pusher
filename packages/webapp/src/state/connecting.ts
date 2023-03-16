import { atom, useRecoilState } from "recoil";

type Connection = {
  actionA?: string;
  actionB?: string;
};

export const connectingAtom = atom<Connection>({
  key: "Connecting",
  default: {},
});

export const useConnectingAtom = () => useRecoilState(connectingAtom);
